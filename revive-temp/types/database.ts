export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          address: string | null
          business_name: string
          city: string | null
          email: string | null
          facebook_url: string | null
          google_maps_url: string | null
          id: number
          instagram_url: string | null
          latitude: number | null
          longitude: number | null
          opening_hours: Json | null
          phone: string | null
          postal_code: string | null
          state: string | null
          tagline: string | null
          updated_at: string
          whatsapp_number: string | null
          youtube_url: string | null
          logo_url: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string
          city?: string | null
          email?: string | null
          facebook_url?: string | null
          google_maps_url?: string | null
          id?: number
          instagram_url?: string | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tagline?: string | null
          updated_at?: string
          whatsapp_number?: string | null
          youtube_url?: string | null
          logo_url?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          city?: string | null
          email?: string | null
          facebook_url?: string | null
          google_maps_url?: string | null
          id?: number
          instagram_url?: string | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tagline?: string | null
          updated_at?: string
          whatsapp_number?: string | null
          youtube_url?: string | null
          logo_url?: string | null
        }
        Relationships: []
      }
      contact_enquiries: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["contact_enquiry_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["contact_enquiry_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["contact_enquiry_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_path: string | null
          is_active: boolean
          is_featured: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          is_featured?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          category: Database["public"]["Enums"]["gallery_category"]
          created_at: string
          description: string | null
          id: string
          image_path: string
          is_featured: boolean
          is_published: boolean
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["gallery_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_path: string
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["gallery_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_settings: {
        Row: {
          id: number
          interval_seconds: number
          transition: string
          updated_at: string
        }
        Insert: {
          id?: number
          interval_seconds?: number
          transition?: string
          updated_at?: string
        }
        Update: {
          id?: number
          interval_seconds?: number
          transition?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          alt_text: string | null
          created_at: string
          desktop_url: string
          id: string
          is_active: boolean
          mobile_url: string | null
          sort_order: number
          tablet_url: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          desktop_url: string
          id?: string
          is_active?: boolean
          mobile_url?: string | null
          sort_order?: number
          tablet_url?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          desktop_url?: string
          id?: string
          is_active?: boolean
          mobile_url?: string | null
          sort_order?: number
          tablet_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      image_assignment_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          media_id: string | null
          new_url: string | null
          previous_url: string | null
          slot_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          media_id?: string | null
          new_url?: string | null
          previous_url?: string | null
          slot_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          media_id?: string | null
          new_url?: string | null
          previous_url?: string | null
          slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_assignment_history_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_assignment_history_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "image_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      image_slots: {
        Row: {
          alt_text: string | null
          created_at: string
          current_media_id: string | null
          current_url: string | null
          description: string | null
          id: string
          is_active: boolean
          section: string
          slot_key: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          current_media_id?: string | null
          current_url?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          section: string
          slot_key: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          current_media_id?: string | null
          current_url?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          section?: string
          slot_key?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "image_slots_current_media_id_fkey"
            columns: ["current_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          created_at: string
          created_by: string | null
          file_name: string
          file_size: number | null
          id: string
          mime_type: string | null
          public_url: string
          storage_bucket: string
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          public_url: string
          storage_bucket?: string
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string
          storage_bucket?: string
          storage_path?: string
        }
        Relationships: []
      }
      membership_plans: {
        Row: {
          billing_period: Database["public"]["Enums"]["billing_period"]
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          price: number | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          billing_period?: Database["public"]["Enums"]["billing_period"]
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          price?: number | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          billing_period?: Database["public"]["Enums"]["billing_period"]
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          price?: number | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      program_slides: {
        Row: {
          id: string
          program_id: string
          image_url: string
          alt_text: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id: string
          image_url: string
          alt_text?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          image_url?: string
          alt_text?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_slides_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
      }
      programs: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          gallery_images: string[] | null
          id: string
          image_path: string | null
          is_active: boolean
          is_featured: boolean
          level: Database["public"]["Enums"]["program_level"]
          name: string
          short_description: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          gallery_images?: string[] | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          is_featured?: boolean
          level?: Database["public"]["Enums"]["program_level"]
          name: string
          short_description?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          gallery_images?: string[] | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          is_featured?: boolean
          level?: Database["public"]["Enums"]["program_level"]
          name?: string
          short_description?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          is_featured: boolean
          is_published: boolean
          rating: number
          review_date: string | null
          review_text: string
          reviewer_name: string
          reviewer_role: string | null
          sort_order: number
          source: Database["public"]["Enums"]["review_source"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          rating: number
          review_date?: string | null
          review_text: string
          reviewer_name: string
          reviewer_role?: string | null
          sort_order?: number
          source?: Database["public"]["Enums"]["review_source"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          rating?: number
          review_date?: string | null
          review_text?: string
          reviewer_name?: string
          reviewer_role?: string | null
          sort_order?: number
          source?: Database["public"]["Enums"]["review_source"]
          updated_at?: string
        }
        Relationships: []
      }
      schedule_items: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          level: Database["public"]["Enums"]["program_level"] | null
          location: string | null
          program_id: string
          start_time: string
          trainer_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          level?: Database["public"]["Enums"]["program_level"] | null
          location?: string | null
          program_id: string
          start_time: string
          trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          level?: Database["public"]["Enums"]["program_level"] | null
          location?: string | null
          program_id?: string
          start_time?: string
          trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_items_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_items_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          image_desktop_path: string | null
          image_mobile_path: string | null
          image_tablet_path: string | null
          is_active: boolean
          is_featured: boolean
          name: string
          profile_image_path: string | null
          role: string
          short_bio: string | null
          slug: string
          sort_order: number
          specialties: string[] | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          image_desktop_path?: string | null
          image_mobile_path?: string | null
          image_tablet_path?: string | null
          is_active?: boolean
          is_featured?: boolean
          name: string
          profile_image_path?: string | null
          role: string
          short_bio?: string | null
          slug: string
          sort_order?: number
          specialties?: string[] | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          image_desktop_path?: string | null
          image_mobile_path?: string | null
          image_tablet_path?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: string
          profile_image_path?: string | null
          role?: string
          short_bio?: string | null
          slug?: string
          sort_order?: number
          specialties?: string[] | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      trial_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          program_id: string | null
          status: Database["public"]["Enums"]["trial_request_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          program_id?: string | null
          status?: Database["public"]["Enums"]["trial_request_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          program_id?: string | null
          status?: Database["public"]["Enums"]["trial_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_requests_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: { Args: never; Returns: string }
      submit_contact_enquiry: {
        Args: {
          p_email: string
          p_message: string
          p_name: string
          p_phone?: string
          p_subject: string
        }
        Returns: string
      }
      submit_trial_request: {
        Args: {
          p_email?: string
          p_message?: string
          p_name: string
          p_phone: string
          p_preferred_date?: string
          p_preferred_time?: string
          p_program_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      billing_period: "monthly" | "quarterly" | "annually"
      contact_enquiry_status: "new" | "contacted" | "resolved" | "spam"
      gallery_category: "training" | "gym" | "coaches" | "community" | "events"
      program_level: "beginner" | "intermediate" | "advanced" | "all_levels"
      review_source: "google" | "facebook" | "internal" | "other"
      trial_request_status:
        | "pending"
        | "contacted"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      billing_period: ["monthly", "quarterly", "annually"],
      contact_enquiry_status: ["new", "contacted", "resolved", "spam"],
      gallery_category: ["training", "gym", "coaches", "community", "events"],
      program_level: ["beginner", "intermediate", "advanced", "all_levels"],
      review_source: ["google", "facebook", "internal", "other"],
      trial_request_status: [
        "pending",
        "contacted",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
    },
  },
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Convenience type aliases — re-exported for use throughout the codebase
// ─────────────────────────────────────────────────────────────────────────────
export type GalleryItem     = Tables<'gallery_items'>
export type GalleryCategory = Database['public']['Enums']['gallery_category']
export type Program         = Tables<'programs'>
export type ProgramLevel    = Database['public']['Enums']['program_level']
export type Trainer         = Tables<'trainers'>
export type BusinessSettings = Tables<'business_settings'>
export type MembershipPlan  = Tables<'membership_plans'>
export type TrialRequest    = Tables<'trial_requests'>
export type TrialRequestStatus = Database['public']['Enums']['trial_request_status']
export type ContactEnquiry  = Tables<'contact_enquiries'>
export type ContactEnquiryStatus = Database['public']['Enums']['contact_enquiry_status']
export type Review          = Tables<'reviews'>
export type FAQ             = Tables<'faqs'>
export type Facility        = Tables<'facilities'>
export type ScheduleItem    = Tables<'schedule_items'>
export type Profile         = Tables<'profiles'>
export type ImageSlot       = Tables<'image_slots'>
export type MediaAsset      = Tables<'media_assets'>
export type ImageAssignmentHistory = Tables<'image_assignment_history'>
export type HeroSlideRow    = Tables<'hero_slides'>
export type HeroSettingsRow = Tables<'hero_settings'>
