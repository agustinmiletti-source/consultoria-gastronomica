export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          business_name: string | null;
          contact_name: string | null;
          email: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          business_name?: string | null;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          business_name?: string | null;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      sales: {
        Row: {
          id: string;
          client_id: string;
          sale_date: string;
          amount: number;
          channel: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          sale_date: string;
          amount: number;
          channel?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          sale_date?: string;
          amount?: number;
          channel?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sales_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: {
          id: string;
          client_id: string;
          expense_date: string;
          amount: number;
          category: string;
          vendor: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          expense_date: string;
          amount: number;
          category: string;
          vendor?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          expense_date?: string;
          amount?: number;
          category?: string;
          vendor?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      monthly_client_metrics: {
        Row: {
          client_id: string;
          client_name: string;
          month: string;
          total_sales: number;
          total_expenses: number;
          net_profit: number;
          net_margin: number;
          break_even_point: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Sale = Database["public"]["Tables"]["sales"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
