export type FormData = {
  name: string;
  mobile: string;
  address: string;
};

export type FormErrors = Partial<Record<keyof FormData, string>>;

export function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "নাম আবশ্যক";
  } else if (data.name.trim().length < 2) {
    errors.name = "নাম কমপক্ষে ২ অক্ষর হতে হবে";
  }

  if (!data.mobile.trim()) {
    errors.mobile = "মোবাইল নম্বর আবশ্যক";
  } else if (!/^[6-9]\d{9}$/.test(data.mobile.replace(/\s/g, ""))) {
    errors.mobile = "সঠিক মোবাইল নম্বর দিন (১০ সংখ্যা)";
  }

  // address is optional — validate only if provided
  if (data.address.trim() && data.address.trim().length < 5) {
    errors.address = "ঠিকানা কমপক্ষে ৫ অক্ষর হতে হবে";
  }

  return errors;
}
