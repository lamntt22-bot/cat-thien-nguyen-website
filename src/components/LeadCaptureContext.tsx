"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import RegisterPopup from "@/components/RegisterPopup";
import FloatingContactButton from "@/components/FloatingContactButton";
import type { ProductRecord } from "@/lib/product-store";

// Trang quét QR tại sự kiện — khách quét mã là phải vào thẳng form quay thưởng,
// không để popup đăng ký ưu đãi tự bật lên che mất sau 3 giây.
const AUTO_OPEN_DISABLED_PATHS = ["/vong-quay-may-man"];

interface OpenOptions {
  product?: string;
}

interface LeadCaptureContextValue {
  open: (options?: OpenOptions) => void;
}

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);
const SESSION_FLAG = "ctn_popup_shown";
const AUTO_OPEN_DELAY_MS = 3000;

export function useLeadCapture() {
  const ctx = useContext(LeadCaptureContext);
  if (!ctx) {
    throw new Error("useLeadCapture must be used within LeadCaptureProvider");
  }
  return ctx;
}

export function LeadCaptureProvider({
  children,
  products,
}: {
  children: ReactNode;
  products: ProductRecord[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<string | undefined>();
  const pathname = usePathname();
  const autoOpenDisabled = AUTO_OPEN_DISABLED_PATHS.includes(pathname);

  const open = useCallback((options?: OpenOptions) => {
    setProduct(options?.product);
    setIsOpen(true);
    try {
      sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      // sessionStorage unavailable — non-fatal, popup can just reshow next visit
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (autoOpenDisabled) return;
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      // ignore
    }
    if (alreadyShown) return;
    const timer = setTimeout(() => open(), AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenDisabled]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LeadCaptureContext.Provider value={value}>
      {children}
      {!isOpen && <FloatingContactButton />}
      <RegisterPopup
        isOpen={isOpen}
        onClose={close}
        initialProduct={product}
        products={products}
      />
    </LeadCaptureContext.Provider>
  );
}
