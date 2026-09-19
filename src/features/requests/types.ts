export type RequestType = "consultation" | "general_inquiry";
export type RequestStatus = "pending" | "responded" | "converted";

export interface CustomerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  requestType: RequestType;
  requestedTreatment?: string;
  message: string;
  createdAt: string; // ISO date string
  status: RequestStatus;
  replyMessage?: string;
  respondedAt?: string;
  convertedClientId?: string;
  convertedAt?: string;
}

export interface CreateRequestInput {
  name: string;
  email: string;
  phone: string;
  requestType: RequestType;
  requestedTreatment?: string;
  message: string;
}

export interface ReplyRequestInput {
  requestId: string;
  replyMessage: string;
}
