export const referralCode = (): string => {
  const upperBound = 1000000 - 1; // Ensures the maximum number is 999999
  const randomInt = Math.floor(Math.random() * upperBound) + 100000;

  // Pad the number with leading zeros if necessary
  return randomInt.toString().padStart(6, "0");
};
