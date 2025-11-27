/**
 * Image Upload Service
 * Handles image selection, compression, and upload
 */

import {launchImageLibrary, launchCamera, ImagePickerResponse, Asset} from 'react-native-image-picker';
import {Platform, Alert, PermissionsAndroid} from 'react-native';
import {logger} from '../../utils/logger';
import {userService} from '../user/userService';

export interface ImagePickerOptions {
  mediaType?: 'photo' | 'video' | 'mixed';
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
}

export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  type: string;
}

class ImageUploadService {
  /**
   * Request camera permission (Android)
   */
  private async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      logger.error('Error requesting camera permission', error);
      return false;
    }
  }

  /**
   * Request storage permission (Android)
   */
  private async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const apiLevel = parseInt(Platform.Version.toString(), 10);
      
      if (apiLevel >= 33) {
        // Android 13+ uses READ_MEDIA_IMAGES
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android < 13 uses READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      logger.error('Error requesting storage permission', error);
      return false;
    }
  }

  /**
   * Pick image from library
   */
  async pickFromLibrary(options: ImagePickerOptions = {}): Promise<Asset | null> {
    const hasPermission = await this.requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Storage permission is required to select images.');
      return null;
    }

    return new Promise((resolve) => {
      launchImageLibrary(
        {
          mediaType: options.mediaType || 'photo',
          quality: options.quality || 0.8,
          maxWidth: options.maxWidth || 1024,
          maxHeight: options.maxHeight || 1024,
          selectionLimit: 1,
          includeBase64: false,
        },
        (response: ImagePickerResponse) => {
          if (response.didCancel) {
            resolve(null);
            return;
          }

          if (response.errorCode) {
            logger.error('Image picker error', response.errorMessage);
            Alert.alert('Error', response.errorMessage || 'Failed to pick image');
            resolve(null);
            return;
          }

          const asset = response.assets?.[0];
          if (asset) {
            resolve(asset);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Take photo with camera
   */
  async takePhoto(options: ImagePickerOptions = {}): Promise<Asset | null> {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return null;
    }

    return new Promise((resolve) => {
      launchCamera(
        {
          mediaType: options.mediaType || 'photo',
          quality: options.quality || 0.8,
          maxWidth: options.maxWidth || 1024,
          maxHeight: options.maxHeight || 1024,
          saveToPhotos: true,
          includeBase64: false,
        },
        (response: ImagePickerResponse) => {
          if (response.didCancel) {
            resolve(null);
            return;
          }

          if (response.errorCode) {
            logger.error('Camera error', response.errorMessage);
            Alert.alert('Error', response.errorMessage || 'Failed to take photo');
            resolve(null);
            return;
          }

          const asset = response.assets?.[0];
          if (asset) {
            resolve(asset);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Show image source selection dialog
   */
  async showImageSourceDialog(options: ImagePickerOptions = {}): Promise<Asset | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image Source',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const asset = await this.takePhoto(options);
              resolve(asset);
            },
          },
          {
            text: 'Photo Library',
            onPress: async () => {
              const asset = await this.pickFromLibrary(options);
              resolve(asset);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        {cancelable: true}
      );
    });
  }

  /**
   * Upload image
   */
  async uploadImage(
    asset: Asset,
    endpoint: string = '/users/me/avatar'
  ): Promise<UploadResult> {
    if (!asset.uri) {
      throw new Error('Image URI is required');
    }

    try {
      const result = await userService.uploadAvatar(asset.uri);
      
      return {
        url: result.avatarUrl,
        fileName: asset.fileName || 'image.jpg',
        size: asset.fileSize || 0,
        type: asset.type || 'image/jpeg',
      };
    } catch (error: any) {
      logger.error('Error uploading image', error);
      throw new Error(error.message || 'Failed to upload image');
    }
  }

  /**
   * Compress image (if needed)
   */
  async compressImage(asset: Asset, maxSize: number = 500): Promise<Asset> {
    // For now, return the asset as-is
    // In production, you might want to use react-native-image-resizer
    // to compress images before upload
    return asset;
  }

  /**
   * Validate image
   */
  validateImage(asset: Asset, maxSizeMB: number = 5): {valid: boolean; error?: string} {
    if (!asset.uri) {
      return {valid: false, error: 'Image URI is required'};
    }

    const sizeMB = (asset.fileSize || 0) / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return {
        valid: false,
        error: `Image size must be less than ${maxSizeMB}MB`,
      };
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (asset.type && !allowedTypes.includes(asset.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, and WebP images are allowed',
      };
    }

    return {valid: true};
  }
}

export const imageUploadService = new ImageUploadService();

