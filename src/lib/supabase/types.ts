export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, unknown> }>;
  };
};
