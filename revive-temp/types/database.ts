export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          status: Database['public']['Enums']['contact_enquiry_status']
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
          status?: Database['public']['Enums']['contact_enquiry_status']
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
          status?: Database['public']['Enums']['contact_enquiry_status']
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
          category: Database['public']['Enums']['gallery_category']
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
          category?: Database['public']['Enums']['gallery_category']
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
          category?: Database['public']['Enums']['gallery_category']
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
      membership_plans: {
        Row: {
          billing_period: Database['public']['Enums']['billing_period']
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
          billing_period?: Database['public']['Enums']['billing_period']
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
          billing_period?: Database['public']['Enums']['billing_period']
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
      programs: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          image_path: string | null
          is_active: boolean
          is_featured: boolean
          level: Database['public']['Enums']['program_level']
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
          id?: string
          image_path?: string | null
          is_active?: boolean
          is_featured?: boolean
          level?: Database['public']['Enums']['program_level']
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
          id?: string
          image_path?: string | null
          is_active?: boolean
          is_featured?: boolean
          level?: Database['public']['Enums']['program_level']
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
          source: Database['public']['Enums']['review_source']
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
          source?: Database['public']['Enums']['review_source']
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
          source?: Database['public']['Enums']['review_source']
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
          level: Database['public']['Enums']['program_level'] | null
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
          level?: Database['public']['Enums']['program_level'] | null
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
          level?: Database['public']['Enums']['program_level'] | null
          location?: string | null
          program_id?: string
          start_time?: string
          trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'schedule_items_program_id_fkey'
            columns: ['program_id']
            isOneToOne: false
            referencedRelation: 'programs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'schedule_items_trainer_id_fkey'
            columns: ['trainer_id']
            isOneToOne: false
            referencedRelation: 'trainers'
            referencedColumns: ['id']
          },
        ]
      }
      trainers: {
        Row: {
          bio: string | null
          created_at: string
          id: string
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
          status: Database['public']['Enums']['trial_request_status']
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
          status?: Database['public']['Enums']['trial_request_status']
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
          status?: Database['public']['Enums']['trial_request_status']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'trial_requests_program_id_fkey'
            columns: ['program_id']
            isOneToOne: false
            referencedRelation: 'programs'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          id: string
          admin_user_id: string
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
          p_email: string
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
      billing_period: 'monthly' | 'quarterly' | 'annually'
      contact_enquiry_status: 'new' | 'contacted' | 'resolved' | 'spam'
      gallery_category: 'training' | 'gym' | 'coaches' | 'community' | 'events'
      program_level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
      review_source: 'google' | 'facebook' | 'internal' | 'other'
      trial_request_status:
        | 'pending'
        | 'contacted'
        | 'confirmed'
        | 'completed'
        | 'cancelled'
        | 'no_show'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Domain types
export type Program = Tables<'programs'>
export type Trainer = Tables<'trainers'>
export type Facility = Tables<'facilities'>
export type MembershipPlan = Tables<'membership_plans'>
export type ScheduleItem = Tables<'schedule_items'>
export type GalleryItem = Tables<'gallery_items'>
export type Review = Tables<'reviews'>
export type FAQ = Tables<'faqs'>
export type BusinessSettings = Tables<'business_settings'>
export type TrialRequest = Tables<'trial_requests'>
export type ContactEnquiry = Tables<'contact_enquiries'>

// Enum types
export type ProgramLevel = Enums<'program_level'>
export type BillingPeriod = Enums<'billing_period'>
export type ReviewSource = Enums<'review_source'>
export type TrialRequestStatus = Enums<'trial_request_status'>
export type ContactEnquiryStatus = Enums<'contact_enquiry_status'>
export type GalleryCategory = Enums<'gallery_category'>

// Admin domain types
export type AdminProfile = Tables<'profiles'>
export type AdminAuditLog = Tables<'admin_audit_logs'>
export type AdminRole = 'admin' | 'manager'
