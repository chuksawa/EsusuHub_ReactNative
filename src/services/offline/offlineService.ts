/**
 * Offline Service
 * Handles offline data synchronization and queue management
 */

import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '../../utils/logger';

const QUEUE_KEY = '@offline_queue';

interface QueuedAction {
  id: string;
  type: 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  data?: any;
  timestamp: number;
  retries: number;
}

class OfflineService {
  private queue: QueuedAction[] = [];
  private maxRetries = 3;
  private isProcessing = false;

  /**
   * Initialize offline service
   */
  async initialize(): Promise<void> {
    await this.loadQueue();
    this.startNetworkListener();
  }

  /**
   * Load queue from storage
   */
  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        logger.info(`Loaded ${this.queue.length} queued actions`);
      }
    } catch (error) {
      logger.error('Error loading offline queue', error);
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      logger.error('Error saving offline queue', error);
    }
  }

  /**
   * Add action to queue
   */
  async queueAction(
    type: 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<string> {
    const action: QueuedAction = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(action);
    await this.saveQueue();

    logger.info(`Queued action: ${type} ${endpoint}`);

    // Try to process if online
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      this.processQueue();
    }

    return action.id;
  }

  /**
   * Process queued actions
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      logger.info('Cannot process queue: offline');
      return;
    }

    this.isProcessing = true;
    logger.info(`Processing ${this.queue.length} queued actions`);

    const {apiClient} = await import('../api/apiClient');
    const actionsToProcess = [...this.queue];
    const successfulActions: string[] = [];

    for (const action of actionsToProcess) {
      try {
        let response;
        switch (action.type) {
          case 'POST':
            response = await apiClient.post(action.endpoint, action.data);
            break;
          case 'PUT':
            response = await apiClient.put(action.endpoint, action.data);
            break;
          case 'DELETE':
            response = await apiClient.delete(action.endpoint);
            break;
        }

        // Success - remove from queue
        successfulActions.push(action.id);
        logger.info(`Processed queued action: ${action.type} ${action.endpoint}`);
      } catch (error: any) {
        // Increment retry count
        action.retries += 1;

        // Remove if max retries reached
        if (action.retries >= this.maxRetries) {
          successfulActions.push(action.id);
          logger.warn(
            `Removed action after ${this.maxRetries} retries: ${action.type} ${action.endpoint}`
          );
        }
      }
    }

    // Remove successful/failed actions
    this.queue = this.queue.filter(action => !successfulActions.includes(action.id));
    await this.saveQueue();

    this.isProcessing = false;

    if (successfulActions.length > 0) {
      logger.info(`Processed ${successfulActions.length} queued actions`);
    }
  }

  /**
   * Start network listener
   */
  private startNetworkListener(): void {
    NetInfo.addEventListener(state => {
      if (state.isConnected && this.queue.length > 0) {
        logger.info('Network connected, processing queue');
        this.processQueue();
      }
    });
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {count: number; actions: QueuedAction[]} {
    return {
      count: this.queue.length,
      actions: [...this.queue],
    };
  }

  /**
   * Clear queue
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await AsyncStorage.removeItem(QUEUE_KEY);
    logger.info('Offline queue cleared');
  }
}

export const offlineService = new OfflineService();

