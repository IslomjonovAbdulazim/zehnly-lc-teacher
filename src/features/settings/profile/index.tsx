import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection
      title='Profil'
      desc='Boshqalar sizni saytda shunday ko`rishadi.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
