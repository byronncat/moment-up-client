"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function InputOTPPattern({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      value={value}
      onChange={onChange}
    >
      <InputOTPGroup className="mx-auto">
        <InputOTPSlot index={0} className="size-10" />
        <InputOTPSlot index={1} className="size-10" />
        <InputOTPSlot index={2} className="size-10" />
        <InputOTPSlot index={3} className="size-10" />
        <InputOTPSlot index={4} className="size-10" />
        <InputOTPSlot index={5} className="size-10" />
      </InputOTPGroup>
    </InputOTP>
  );
}
