import { useState } from "react";
import { Send, Globe } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRequestsContext } from "@/features/requests/RequestsContext";
import { useNotificationsContext } from "@/features/notifications/NotificationsContext";
import type { RequestType } from "@/features/requests/types";

interface SimulateWebsiteRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const TREATMENTS = [
  "Botox Cosmetic",
  "Dermal Fillers",
  "HydraFacial Deluxe",
  "Laser Hair Removal",
  "Chemical Peel",
  "Microneedling (SkinPen)",
  "Body Contouring (CoolSculpting)",
  "General Skin Consultation",
];

export function SimulateWebsiteRequestModal({ open, onClose }: SimulateWebsiteRequestModalProps) {
  const { createRequest } = useRequestsContext();
  const { addNotification } = useNotificationsContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestType, setRequestType] = useState<RequestType>("consultation");
  const [requestedTreatment, setRequestedTreatment] = useState(TREATMENTS[0]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createRequest({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        requestType,
        requestedTreatment,
        message: message.trim(),
      });

      // Pushes real-time notification to top Navbar
      addNotification({
        title: requestType === "consultation" ? "New Consultation Request" : "New General Inquiry",
        description: `${created.name} submitted a request for ${created.requestedTreatment || "Consultation"}.`,
        category: "appointment",
        linkTo: "/customer-requests",
      });

      setIsSubmitting(false);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      onClose();
    }, 400);
  };

  return (
    <Modal open={open} onClose={onClose} title="Simulate Website Inquiry Form" size="md">
      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-[#E8F4F0] p-3 text-xs text-[#1A6B52]">
        <Globe className="h-4 w-4 shrink-0 text-[#1A6B52]" />
        <span>
          Simulate a prospective client filling out the public contact/booking form on the <strong>Lumière MedSpa website</strong>.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name *"
            placeholder="e.g. Jessica Sterling"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Phone Number *"
            placeholder="(310) 555-0199"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <Input
          label="Email Address *"
          type="email"
          placeholder="jessica@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-body text-xs font-medium text-[#374151]">
              Request Type *
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as RequestType)}
              className="w-full rounded-xl border border-[#E8E4DF] bg-white py-2.5 px-3 text-sm text-[#1C1C1A] outline-none focus:border-[#1A6B52]"
            >
              <option value="consultation">Consultation Request</option>
              <option value="general_inquiry">General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block font-body text-xs font-medium text-[#374151]">
              Requested Service / Treatment
            </label>
            <select
              value={requestedTreatment}
              onChange={(e) => setRequestedTreatment(e.target.value)}
              className="w-full rounded-xl border border-[#E8E4DF] bg-white py-2.5 px-3 text-sm text-[#1C1C1A] outline-none focus:border-[#1A6B52]"
            >
              {TREATMENTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-[#374151]">
            Inquiry Message *
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your aesthetic goals, preferred dates, or questions..."
            required
            className="w-full rounded-xl border border-[#E8E4DF] bg-white p-3 text-sm text-[#1C1C1A] placeholder-[#9CA3AF] outline-none focus:border-[#1A6B52]"
          />
        </div>

        <div className="mt-2 flex justify-end gap-2 border-t border-[#E8E4DF] pt-4">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Send className="h-3.5 w-3.5" />}
          >
            Submit Website Form
          </Button>
        </div>
      </form>
    </Modal>
  );
}
