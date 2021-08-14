export function validateNotEmpty(jsonToValidate: any, validationForm: any): boolean {
  let isValid = true;
  Object.entries(jsonToValidate).forEach(([key, value]) => {
    if (value == null || value == "") {
      validationForm[key] = "Este campo es obligatorio";
      isValid = false;
    }
  });
  return isValid;
}

export function propertiesSubSet <T>(properties: string[], object: T): T {
  const subset = Object.fromEntries(
    Object.entries(object)
    .filter(([key]) => properties.includes(key))
  ) as T;

  return subset;
}

export function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password: string) {
  const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
  return re.test(password);
}

export function validatePhone(phoneNumber: string) {
  const re = /^(?=.{9})(?!.{16})\+?\d+(-\d+)*$/;
  return re.test(phoneNumber);
}

export async function  handleErrors(response: Response) {
  if (!response.ok) {
    const res = await response.text();
    throw new Error(res);
  }
}