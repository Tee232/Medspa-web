import { useState, useMemo } from "react";
import type { CustomerRequest, CreateRequestInput } from "./types";
import { mockRequests } from "./mockData";

export function useRequests() {
  const [requests, setRequests] = useState<CustomerRequest[]>(mockRequests);

  function getById(id: string): CustomerRequest | undefined {
    return requests.find((r) => r.id === id);
  }

  function createRequest(input: CreateRequestInput): CustomerRequest {
    const newReq: CustomerRequest = {
      id: `req-${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      requestType: input.requestType,
      requestedTreatment: input.requestedTreatment || "General Consultation",
      message: input.message,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    setRequests((prev) => [newReq, ...prev]);
    return newReq;
  }

  function replyToRequest(id: string, replyMessage: string) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "converted" ? "converted" : "responded",
              replyMessage,
              respondedAt: new Date().toISOString(),
            }
          : r
      )
    );
  }

  function markAsConverted(id: string, clientId: string) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "converted",
              convertedClientId: clientId,
              convertedAt: new Date().toISOString(),
            }
          : r
      )
    );
  }

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const responded = requests.filter((r) => r.status === "responded").length;
    const converted = requests.filter((r) => r.status === "converted").length;
    const consultations = requests.filter((r) => r.requestType === "consultation").length;
    const inquiries = requests.filter((r) => r.requestType === "general_inquiry").length;

    return {
      total: requests.length,
      pending,
      responded,
      converted,
      consultations,
      inquiries,
    };
  }, [requests]);

  return {
    requests,
    stats,
    getById,
    createRequest,
    replyToRequest,
    markAsConverted,
  };
}
