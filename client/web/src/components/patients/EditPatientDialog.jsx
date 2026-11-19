import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogCloseButton,
} from '../ui/dialog.jsx';
import { Button } from '../ui/button.jsx';
import { Alert, AlertDescription } from '../ui/alert.jsx';
import * as patientsService from '../../services/patientsService.js';
import { extractApiError } from '../../services/apiClient.js';
import {
  PATIENT_GENDERS,
  PATIENT_BLOOD_GROUPS,
  PREFERRED_LANGUAGES,
  PREFERRED_COMMUNICATION_METHODS,
  labelFor,
} from '../../constants/patients.js';

const inputClass = 'w-full min-h-[44px] h-11 sm:h-10 rounded-xl border border-border bg-background px-3 text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60';
const labelClass = 'text-xs font-medium text-muted-foreground mb-1 block';

const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');

const buildForm = (profile) => ({
  firstName: profile?.firstName || '',
  lastName: profile?.lastName || '',
  gender: profile?.gender || 'FEMALE',
  dateOfBirth: toDateInput(profile?.dateOfBirth),
  bloodGroup: profile?.bloodGroup || '',
  phone: profile?.phone || '',
  alternatePhone: profile?.alternatePhone || '',
  nationality: profile?.nationality || '',
  nationalIdNumber: profile?.nationalIdNumber || '',
  street: profile?.address?.street || '',
  city: profile?.address?.city || '',
  state: profile?.address?.state || '',
  postalCode: profile?.address?.postalCode || '',
  country: profile?.address?.country || '',
  emergencyName: profile?.emergencyContact?.name || '',
  emergencyRelationship: profile?.emergencyContact?.relationship || '',
  emergencyPhone: profile?.emergencyContact?.phone || '',
  emergencyAlternatePhone: profile?.emergencyContact?.alternatePhone || '',
  emergencyEmail: profile?.emergencyContact?.email || '',
  emergencyAddress: profile?.emergencyContact?.address || '',
  preferredLanguage: profile?.preferredLanguage || 'en',
  preferredCommunicationMethod: profile?.preferredCommunicationMethod || 'EMAIL',
});

/**
 * FET-06 — edit a patient's demographics, contact info, emergency
 * contact, and preferences via `PATCH /patients/:id`
 * (`PATIENTS_WRITE`). Deliberately never touches the medical-history
 * fields — those have their own dedicated add/remove UI
 * (`MedicalHistoryTab`) gated on the separate `MEDICAL_RECORDS_WRITE`
 * permission, matching the backend's field-level separation.
 */
export default function EditPatientDialog({ open, onOpenChange, profile, onSaved }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(() => buildForm(profile));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (name) => (event) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleClose = (nextOpen) => {
    if (nextOpen) setForm(buildForm(profile));
    if (!saving) setError('');
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await patientsService.updatePatient(profile.id || profile._id, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        bloodGroup: form.bloodGroup || null,
        phone: form.phone.trim(),
        alternatePhone: form.alternatePhone.trim(),
        nationality: form.nationality.trim(),
        nationalIdNumber: form.nationalIdNumber.trim(),
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
        },
        emergencyContact: {
          name: form.emergencyName.trim(),
          relationship: form.emergencyRelationship.trim(),
          phone: form.emergencyPhone.trim(),
          alternatePhone: form.emergencyAlternatePhone.trim(),
          email: form.emergencyEmail.trim(),
          address: form.emergencyAddress.trim(),
        },
        preferredLanguage: form.preferredLanguage,
        preferredCommunicationMethod: form.preferredCommunicationMethod,
      });
      onOpenChange(false);
      onSaved?.(updated);
    } catch (err) {
      setError(extractApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} className="max-w-2xl">
      {open ? (
        <form onSubmit={handleSubmit} className="relative">
          <DialogCloseButton onClose={() => handleClose(false)} />
          <DialogHeader>
            <DialogTitle>{t('patients.editDialog.title')}</DialogTitle>
            <DialogDescription>{t('patients.editDialog.description')}</DialogDescription>
          </DialogHeader>

          <div className="mt-4 max-h-[65vh] overflow-y-auto pr-1 space-y-5">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">{t('patients.editDialog.sectionDemographics')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t('patients.editDialog.firstName')}</label>
                  <input required className={inputClass} value={form.firstName} onChange={set('firstName')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.editDialog.lastName')}</label>
                  <input required className={inputClass} value={form.lastName} onChange={set('lastName')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.editDialog.gender')}</label>
                  <select className={inputClass} value={form.gender} onChange={set('gender')}>
                    {PATIENT_GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {labelFor(g, t)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t('patients.editDialog.dateOfBirth')}</label>
                  <input
                    required
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    className={inputClass}
                    value={form.dateOfBirth}
                    onChange={set('dateOfBirth')}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.bloodGroup')}</label>
                  <select className={inputClass} value={form.bloodGroup} onChange={set('bloodGroup')}>
                    <option value="">—</option>
                    {PATIENT_BLOOD_GROUPS.map((b) => (
                      <option key={b} value={b}>
                        {labelFor(b, t)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.nationality')}</label>
                  <input className={inputClass} value={form.nationality} onChange={set('nationality')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.editDialog.nationalIdNumber')}</label>
                  <input
                    className={inputClass}
                    value={form.nationalIdNumber}
                    onChange={set('nationalIdNumber')}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">{t('patients.editDialog.sectionContact')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t('patients.overview.phone')}</label>
                  <input className={inputClass} value={form.phone} onChange={set('phone')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.alternatePhone')}</label>
                  <input className={inputClass} value={form.alternatePhone} onChange={set('alternatePhone')} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{t('patients.editDialog.street')}</label>
                  <input className={inputClass} value={form.street} onChange={set('street')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.editDialog.city')}</label>
                  <input className={inputClass} value={form.city} onChange={set('city')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.editDialog.state')}</label>
                  <input className={inputClass} value={form.state} onChange={set('state')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.editDialog.postalCode')}</label>
                  <input className={inputClass} value={form.postalCode} onChange={set('postalCode')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.editDialog.country')}</label>
                  <input className={inputClass} value={form.country} onChange={set('country')} />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">{t('patients.overview.emergencyContact')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t('patients.overview.name')}</label>
                  <input className={inputClass} value={form.emergencyName} onChange={set('emergencyName')} />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.relationship')}</label>
                  <input
                    className={inputClass}
                    value={form.emergencyRelationship}
                    onChange={set('emergencyRelationship')}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.phone')}</label>
                  <input
                    className={inputClass}
                    value={form.emergencyPhone}
                    onChange={set('emergencyPhone')}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.alternatePhone')}</label>
                  <input
                    className={inputClass}
                    value={form.emergencyAlternatePhone}
                    onChange={set('emergencyAlternatePhone')}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.email')}</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={form.emergencyEmail}
                    onChange={set('emergencyEmail')}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.address')}</label>
                  <input
                    className={inputClass}
                    value={form.emergencyAddress}
                    onChange={set('emergencyAddress')}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">{t('patients.editDialog.sectionPreferences')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t('patients.overview.preferredLanguage')}</label>
                  <select
                    className={inputClass}
                    value={form.preferredLanguage}
                    onChange={set('preferredLanguage')}
                  >
                    {PREFERRED_LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {labelFor(l, t)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t('patients.overview.preferredContactMethod')}</label>
                  <select
                    className={inputClass}
                    value={form.preferredCommunicationMethod}
                    onChange={set('preferredCommunicationMethod')}
                  >
                    {PREFERRED_COMMUNICATION_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {labelFor(m, t)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => handleClose(false)} disabled={saving}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? t('common.saving') : t('patients.editDialog.saveChanges')}
            </Button>
          </DialogFooter>
        </form>
      ) : null}
    </Dialog>
  );
}
