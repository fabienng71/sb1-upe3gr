import type { Product, Customer } from '../types';

const SHEET_ID = '19d6DQcrKLLIpPYwiUcs5ey4CdVkuYQZoutSfVOX2Kd8';

export class GoogleSheetsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleSheetsError';
  }
}

async function fetchSheetData(sheetName: string): Promise<string[][]> {
  try {
    // Using the CSV export URL with gid=0 for the first sheet
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    
    console.log(`Fetching data from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new GoogleSheetsError(`Failed to fetch data: ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Received data:', text.substring(0, 200) + '...'); // Log first 200 chars
    
    if (!text.trim()) {
      throw new GoogleSheetsError('Received empty response from Google Sheets');
    }
    
    // Split by newlines and handle quoted CSV properly
    const rows = text.split('\n').map(row => {
      // Handle quoted values that might contain commas
      const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      return matches.map(value => 
        value.startsWith('"') && value.endsWith('"') 
          ? value.slice(1, -1) 
          : value
      );
    });
    
    console.log('Parsed rows:', rows.length);
    return rows;
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    throw error instanceof GoogleSheetsError
      ? error
      : new GoogleSheetsError('Failed to fetch data from Google Sheets');
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const rows = await fetchSheetData('Items');
    console.log('Product rows:', rows);
    
    // Skip header row and filter out empty rows
    const dataRows = rows.slice(1).filter(row => row.length >= 9 && row[0]?.trim());
    
    return dataRows.map(row => ({
      itemCode: row[0]?.trim() || '',
      description: row[1]?.trim() || '',
      inventory: parseFloat(row[2]?.trim() || '0'),
      baseUnitOfMeasure: row[3]?.trim() || '',
      unitCost: parseFloat(row[4]?.trim() || '0'),
      unitPrice: parseFloat(row[5]?.trim() || '0'),
      vendorNo: row[6]?.trim() || '',
      blocked: row[7]?.trim().toLowerCase() === 'true',
      vendor: row[8]?.trim() || ''
    }));
  } catch (error) {
    console.error('Error processing products:', error);
    throw error instanceof GoogleSheetsError
      ? error
      : new GoogleSheetsError('Failed to process product data');
  }
}

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const rows = await fetchSheetData('Customers');
    console.log('Customer rows:', rows);
    
    // Skip header row and filter out empty rows
    const dataRows = rows.slice(1).filter(row => row.length >= 3 && row[0]?.trim());
    
    return dataRows.map(row => ({
      customerCode: row[0]?.trim() || '',
      companyName: row[1]?.trim() || '',
      searchName: row[2]?.trim() || ''
    }))
    .sort((a, b) => a.searchName.localeCompare(b.searchName));
  } catch (error) {
    console.error('Error processing customers:', error);
    throw error instanceof GoogleSheetsError
      ? error
      : new GoogleSheetsError('Failed to process customer data');
  }
}