export interface Customer {
  customerCode: string;
  companyName: string;
  searchName: string;
}

export interface Product {
  itemCode: string;
  description: string;
  inventory: number;
  baseUnitOfMeasure: string;
  unitCost: number;
  unitPrice: number;
  vendorNo: string;
  blocked: boolean;
  vendor: string;
  selected?: boolean;
}

export interface Quotation {
  id: string;
  customerId: string;
  items: QuotationItem[];
  total: number;
  status: 'pending' | 'accepted' | 'rejected';
  validUntil: string;
  createdAt: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  quotationId: string;
  customerId: string;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
  createdAt: string;
}