import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Stethoscope, User as UserIcon } from 'lucide-react';

import * as staffService from '../services/staffService.js';
import { extractApiError } from '../services/apiClient.js';
import { useAuth } from '../providers/AuthProvider.jsx';
import { useToast } from '../providers/ToastProvider.jsx';
import { PageHeader } from '../components/ui/page-header.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card.jsx';
import { Alert, AlertDescription } from '../components/ui/alert.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { ErrorState } from '../components/ui/empty-state.jsx';
import { STAFF_GENDERS, labelFor } from '../constants/staff.js';

const inputClass =
  'w-full min-h-[44px] h-11 sm:h-10 rounded-xl border border-border bg-background px-3 text-base sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60';
const labelClass = 'text-xs font-medium text-muted-foreground mb-1 block';
const textareaClass =
  'w-full rounded-xl border border-border bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60';

const emptyDoctorDetails = {
  specialization: '',
  qualifications: '', // comma-separated in the UI, array on the wire
  registrationNumber: '',
  yearsOfExperience: '',
  bio: '',
  nameBangla: '',
  degreesBangla: '',
  designationBangla: '',
  departmentBangla: '',
  specialtyBangla: '',
};

const toDateInputValue = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

/**
 * Self-service counterpart to the admin-only StaffDetailPage. Any
 * authenticated staff member (a newly created doctor included) lands
 * here to fill in the details an admin never entered for them —
 * critically the Bangla name/degrees/designation used on the
 * prescription letterhead (`LegalPrescriptionDocument.jsx`), which
 * previously had no data source at all and always showed the
 * practice's hardcoded default doctor. Backed by the real
 * `PATCH /staff/me` endpoint — org-assigned fields (designation,
 * department, employment type/status) aren't editable here and stay
 * admin-only via `/dashboard/staff/:id`.
 */
export default function MyProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isDoctor = user?.role === 'DOCTOR';

  const [profile, setProfile] = useState(null);
  const [state, setState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [form, setForm] = useState({
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: { name: '', relationship: '', phone: '' },
    doctorDetails: emptyDoctorDetails,
  });

  const load = useCallback(async () => {
    setState('loading');
    setErrorMessage('');
    try {
      const data = await staffService.getMyStaffProfile();
      setProfile(data);
      setForm({
        phone: data.phone || '',
        gender: data.gender || '',
        dateOfBirth: toDateInputValue(data.dateOfBirth),
        address: data.address || '',
        emergencyContact: {
          name: data.emergencyContact?.name || '',
          relationship: data.emergencyContact?.relationship || '',
          phone: data.emergencyContact?.phone || '',
        },
        doctorDetails: {
          specialization: data.doctorDetails?.specialization || '',
          qualifications: (data.doctorDetails?.qualifications || []).join(', '),
          registrationNumber: data.doctorDetails?.registrationNumber || '',
          yearsOfExperience: data.doctorDetails?.yearsOfExperience ?? '',
          bio: data.doctorDetails?.bio || '',
          nameBangla: data.doctorDetails?.nameBangla || '',
          degreesBangla: data.doctorDetails?.degreesBangla || '',
          designationBangla: data.doctorDetails?.designationBangla || '',
          departmentBangla: data.doctorDetails?.departmentBangla || '',
          specialtyBangla: data.doctorDetails?.specialtyBangla || '',
        },
      });
      setState('ready');
    } catch (error) {
      setErrorMessage(extractApiError(error).message);
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        phone: form.phone,
        address: form.address,
        emergencyContact: form.emergencyContact,
      };
      if (form.gender) payload.gender = form.gender;
      if (form.dateOfBirth) payload.dateOfBirth = form.dateOfBirth;

      if (isDoctor) {
        payload.doctorDetails = {
          specialization: form.doctorDetails.specialization,
          qualifications: form.doctorDetails.qualifications
            .split(',')
            .map((q) => q.trim())
            .filter(Boolean),
          registrationNumber: form.doctorDetails.registrationNumber,
          bio: form.doctorDetails.bio,
          nameBangla: form.doctorDetails.nameBangla,
          degreesBangla: form.doctorDetails.degreesBangla,
          designationBangla: form.doctorDetails.designationBangla,
          departmentBangla: form.doctorDetails.departmentBangla,
          specialtyBangla: form.doctorDetails.specialtyBangla,
        };
        if (form.doctorDetails.yearsOfExperience !== '') {
          payload.doctorDetails.yearsOfExperience = Number(form.doctorDetails.yearsOfExperience);
        }
      }

      const updated = await staffService.updateMyStaffProfile(payload);
      setProfile(updated);
      toast({ title: t('myProfile.saveSuccess', 'Profile updated.'), variant: 'success' });
    } catch (error) {
      setSaveError(extractApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  if (state === 'loading') {
    return (
      <div>
        <PageHeader title={t('myProfile.title', 'My Profile')} />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div>
        <PageHeader title={t('myProfile.title', 'My Profile')} />
        <ErrorState description={errorMessage} onRetry={load} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('myProfile.title', 'My Profile')}
        description={t(
          'myProfile.description',
          'Your own details — including your Bangla name and credentials shown on prescriptions.',
        )}
        actions={
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? t('common.saving', 'Saving...') : t('common.saveChanges', 'Save changes')}
          </Button>
        }
      />

      {saveError ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserIcon size={18} /> {t('myProfile.identity', 'Identity')}
            </CardTitle>
            <CardDescription>{t('myProfile.identityHint', 'Set by your organization — contact an admin to change these.')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className={labelClass}>{t('myProfile.name', 'Name')}</span>
              <p className="text-sm font-medium">{profile?.user?.name}</p>
            </div>
            <div>
              <span className={labelClass}>{t('myProfile.email', 'Email')}</span>
              <p className="text-sm font-medium">{profile?.user?.email}</p>
            </div>
            <div>
              <span className={labelClass}>{t('myProfile.employeeId', 'Employee ID')}</span>
              <p className="text-sm font-medium">{profile?.employeeId}</p>
            </div>
            <div>
              <span className={labelClass}>{t('myProfile.designation', 'Designation')}</span>
              <div>
                <Badge variant="neutral">{labelFor(profile?.designation) || profile?.designation}</Badge>
              </div>
            </div>
            {profile?.department ? (
              <div>
                <span className={labelClass}>{t('myProfile.department', 'Department')}</span>
                <p className="text-sm font-medium">{profile.department}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t('myProfile.personal', 'Personal details')}</CardTitle>
            <CardDescription>{t('myProfile.personalHint', 'You can update these yourself at any time.')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <span className={labelClass}>{t('myProfile.phone', 'Phone')}</span>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <span className={labelClass}>{t('myProfile.gender', 'Gender')}</span>
                <select
                  className={inputClass}
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                >
                  <option value="">{t('myProfile.notSet', '—')}</option>
                  {STAFF_GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {labelFor(g)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className={labelClass}>{t('myProfile.dateOfBirth', 'Date of birth')}</span>
                <input
                  type="date"
                  className={inputClass}
                  value={form.dateOfBirth}
                  onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                />
              </div>
              <div>
                <span className={labelClass}>{t('myProfile.address', 'Address')}</span>
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">{t('myProfile.emergencyContact', 'Emergency contact')}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  className={inputClass}
                  placeholder={t('myProfile.contactName', 'Name')}
                  value={form.emergencyContact.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emergencyContact: { ...f.emergencyContact, name: e.target.value } }))
                  }
                />
                <input
                  className={inputClass}
                  placeholder={t('myProfile.contactRelationship', 'Relationship')}
                  value={form.emergencyContact.relationship}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      emergencyContact: { ...f.emergencyContact, relationship: e.target.value },
                    }))
                  }
                />
                <input
                  className={inputClass}
                  placeholder={t('myProfile.contactPhone', 'Phone')}
                  value={form.emergencyContact.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emergencyContact: { ...f.emergencyContact, phone: e.target.value } }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isDoctor ? (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope size={18} /> {t('myProfile.clinical', 'Clinical & prescription details')}
              </CardTitle>
              <CardDescription>
                {t(
                  'myProfile.clinicalHint',
                  'These appear on your printed prescriptions and lab requisitions — including the Bangla letterhead. Leave the Bangla fields blank to use the practice default.',
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <span className={labelClass}>{t('myProfile.specialization', 'Specialization (English)')}</span>
                  <input
                    className={inputClass}
                    value={form.doctorDetails.specialization}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, doctorDetails: { ...f.doctorDetails, specialization: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <span className={labelClass}>{t('myProfile.specialtyBangla', 'Specialty (Bangla)')}</span>
                  <input
                    className={inputClass}
                    value={form.doctorDetails.specialtyBangla}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, doctorDetails: { ...f.doctorDetails, specialtyBangla: e.target.value } }))
                    }
                    placeholder="কিডনী রোগ ও কিডনি প্রতিস্থাপন বিশেষজ্ঞ"
                  />
                </div>
                <div>
                  <span className={labelClass}>{t('myProfile.qualifications', 'Degrees (English, comma-separated)')}</span>
                  <input
                    className={inputClass}
                    value={form.doctorDetails.qualifications}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, doctorDetails: { ...f.doctorDetails, qualifications: e.target.value } }))
                    }
                    placeholder="MBBS, MD (Nephrology), FRCP (Edin)"
                  />
                </div>
                <div>
                  <span className={labelClass}>{t('myProfile.degreesBangla', 'Degrees (Bangla)')}</span>
                  <input
                    className={inputClass}
                    value={form.doctorDetails.degreesBangla}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, doctorDetails: { ...f.doctorDetails, degreesBangla: e.target.value } }))
                    }
                    placeholder="এমবিবিএস, এমডি (নেফ্রোলজি), এফআরসিপি (এডিন)"
                  />
                </div>
                <div>
                  <span className={labelClass}>{t('myProfile.nameBangla', 'Your name (Bangla)')}</span>
                  <input
                    className={inputClass}
                    value={form.doctorDetails.nameBangla}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, doctorDetails: { ...f.doctorDetails, nameBangla: e.target.value } }))
                    }
                    placeholder="প্রফেসর ডা. ..."
                  />
                </div>
                <div>
                  <span className={labelClass}>{t('myProfile.designationBangla', 'Designation (Bangla)')}</span>
                  <input
                    className={inputClass}
                    value={form.doctorDetails.designationBangla}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, doctorDetails: { ...f.doctorDetails, designationBangla: e.target.value } }))
                    }
                    placeholder="অধ্যাপক ও বিভাগীয় প্রধান"
                  />
                </div>
                <div>
                  <span className={labelClass}>{t('myProfile.departmentBangla', 'Department (Bangla)')}</span>
                  <input
                    className={inputClass}
                    value={form.doctorDetails.departmentBangla}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, doctorDetails: { ...f.doctorDetails, departmentBangla: e.target.value } }))
                    }
                    placeholder="কিডনী রোগ ও ডায়ালাইসিস বিভাগ"
                  />
                </div>
                <div>
                  <span className={labelClass}>{t('myProfile.registrationNumber', 'Registration number (BM&DC)')}</span>
                  <input
                    className={inputClass}
                    value={form.doctorDetails.registrationNumber}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        doctorDetails: { ...f.doctorDetails, registrationNumber: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <span className={labelClass}>{t('myProfile.yearsOfExperience', 'Years of experience')}</span>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    className={inputClass}
                    value={form.doctorDetails.yearsOfExperience}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        doctorDetails: { ...f.doctorDetails, yearsOfExperience: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <span className={labelClass}>{t('myProfile.bio', 'Short bio')}</span>
                <textarea
                  rows={3}
                  className={textareaClass}
                  value={form.doctorDetails.bio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, doctorDetails: { ...f.doctorDetails, bio: e.target.value } }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
