
export const asset = (p) =>
  `${import.meta.env.BASE_URL}${String(p).replace(/^\/+/, "")}`;
