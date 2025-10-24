// src/features/societyCare/maintenance/maintenanceThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceRecords,
  getResidentMaintenanceRecords,
  listenToMaintenanceRecords,
  listenToResidentMaintenanceRecords
} from '../../../services/firebase/maintenanceService';

// Create maintenance record
export const createMaintenanceRecordThunk = createAsyncThunk(
  'maintenance/createRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      const result = await createMaintenanceRecord(recordData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update maintenance record
export const updateMaintenanceRecordThunk = createAsyncThunk(
  'maintenance/updateRecord',
  async ({ recordId, updates }, { rejectWithValue }) => {
    try {
      const result = await updateMaintenanceRecord(recordId, updates);
      return { recordId, updates: result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete maintenance record
export const deleteMaintenanceRecordThunk = createAsyncThunk(
  'maintenance/deleteRecord',
  async (recordId, { rejectWithValue }) => {
    try {
      await deleteMaintenanceRecord(recordId);
      return recordId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get all maintenance records (Admin)
export const getAllMaintenanceRecordsThunk = createAsyncThunk(
  'maintenance/getAllRecords',
  async (_, { rejectWithValue }) => {
    try {
      const records = await getMaintenanceRecords();
      return records;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get resident maintenance records
export const getResidentMaintenanceRecordsThunk = createAsyncThunk(
  'maintenance/getResidentRecords',
  async (residentId, { rejectWithValue }) => {
    try {
      const records = await getResidentMaintenanceRecords(residentId);
      return records;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mark payment as paid
export const markPaymentPaidThunk = createAsyncThunk(
  'maintenance/markPaid',
  async ({ recordId, paymentData }, { rejectWithValue }) => {
    try {
      const updates = {
        status: 'paid',
        paidDate: new Date().toISOString(),
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId,
        notes: paymentData.notes
      };
      const result = await updateMaintenanceRecord(recordId, updates);
      return { recordId, updates: result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Generate maintenance report
export const generateMaintenanceReportThunk = createAsyncThunk(
  'maintenance/generateReport',
  async ({ startDate, endDate, format = 'csv' }, { rejectWithValue }) => {
    try {
      const records = await getMaintenanceRecords();
      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record.createdAt);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });
      
      if (format === 'csv') {
        const csvData = convertToCSV(filteredRecords);
        return { data: csvData, format: 'csv' };
      }
      
      return { data: filteredRecords, format: 'json' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper function to convert data to CSV
const convertToCSV = (records) => {
  const headers = ['Flat Number', 'Resident Name', 'Amount', 'Description', 'Due Date', 'Status', 'Paid Date'];
  const csvRows = [headers.join(',')];
  
  records.forEach(record => {
    const row = [
      record.flatNumber || '',
      record.residentName || '',
      record.amount || 0,
      `"${record.description || ''}"`,
      record.dueDate || '',
      record.status || '',
      record.paidDate || ''
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};
