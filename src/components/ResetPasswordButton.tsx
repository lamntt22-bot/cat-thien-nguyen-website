"use client";

import { useState } from "react";

export default function ResetPasswordButton({
  memberId,
  memberName,
}: {
  memberId: string;
  memberName: string;
}) {
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    if (
      !window.confirm(
        `Đặt lại mật khẩu của "${memberName}" về mật khẩu mặc định? Khách sẽ phải đổi mật khẩu mới ở lần đăng nhập tiếp theo.`,
      )
    ) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch(`/api/admin/members/${memberId}/reset-password`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        window.alert(data?.error ?? "Đặt lại mật khẩu thất bại, vui lòng thử lại.");
        return;
      }
      window.alert(
        `Đã đặt lại mật khẩu. Mật khẩu tạm thời: ${data.tempPassword}\nBáo lại cho khách để họ đăng nhập và đổi mật khẩu mới.`,
      );
    } finally {
      setResetting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={resetting}
      className="rounded-full border border-maroon-900/20 px-3 py-1.5 text-xs font-semibold text-maroon-900 transition hover:bg-maroon-900/5 disabled:opacity-60"
    >
      {resetting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
    </button>
  );
}
