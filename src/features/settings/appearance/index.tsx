import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title='Ko`rinish'
      desc='Ilova ko`rinishini sozlang. Kunduz va tun mavzulari o`rtasida avtomatik o`tish.'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
