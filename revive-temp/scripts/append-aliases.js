const fs = require('fs');
const path = require('path');

const destFile = path.join(__dirname, '..', 'types', 'database.ts');
const aliases = `
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
`;

let content = fs.readFileSync(destFile, 'utf8');
if (!content.includes('export type GalleryItem')) {
  fs.appendFileSync(destFile, aliases, 'utf8');
  console.log('Aliases appended to database.ts');
} else {
  console.log('Aliases already present');
}
