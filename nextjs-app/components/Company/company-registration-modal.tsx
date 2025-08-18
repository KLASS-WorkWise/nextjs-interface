"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { X, Building2, MapPin, ImageIcon } from "lucide-react"
import Image from "next/image"
import "./company-registration-modal.css"

interface CompanyRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  companyName: string
  employee: string
  email: string
  phone: string
  logoUrl: string
  bannerUrl: string
  address: string
  location: string
  website: string
  industry: string
  description: string
  foundedYear?: string
  facebook?: string
  linkedin?: string
}

export default function CompanyRegistrationModal({ isOpen, onClose }: CompanyRegistrationModalProps) {
  // single-step flow
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [descriptionLength, setDescriptionLength] = useState(0)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    employee: "",
    email: "",
    phone: "",
    logoUrl: "",
    bannerUrl: "",
    address: "",
    location: "",
    website: "",
    industry: "",
    description: "",
    foundedYear: "",
    facebook: "",
    linkedin: "",
  })

  // single-step validation (required fields)
  const isValid = Boolean(formData.companyName && formData.employee && formData.industry && formData.email && formData.phone)

  useEffect(() => {
    // when modal closes, revoke previews
    if (!isOpen) {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
      if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    }
  }, [isOpen, logoPreview, bannerPreview])

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
      if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    }
  }, [logoPreview, bannerPreview])

  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const bannerInputRef = useRef<HTMLInputElement | null>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "description") setDescriptionLength(value.length)
    if (field === "logoUrl") setLogoPreview(value || null)
    if (field === "bannerUrl") setBannerPreview(value || null)
  }

  const handleFileChange = (type: "logo" | "banner", file?: File) => {
    if (type === "logo") {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
      if (file) {
        setLogoFile(file)
        setLogoPreview(URL.createObjectURL(file))
        setFormData((p) => ({ ...p, logoUrl: "" }))
      } else {
        setLogoFile(null)
        setLogoPreview(null)
      }
    } else {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview)
      if (file) {
        setBannerFile(file)
        setBannerPreview(URL.createObjectURL(file))
        setFormData((p) => ({ ...p, bannerUrl: "" }))
      } else {
        setBannerFile(null)
        setBannerPreview(null)
      }
    }
  }

  // single-step: no step navigation functions

  const handleCancel = () => {
    setFormData({
      companyName: "",
      employee: "",
      email: "",
      phone: "",
      logoUrl: "",
      bannerUrl: "",
      address: "",
      location: "",
      website: "",
      industry: "",
      description: "",
  foundedYear: "",
      facebook: "",
      linkedin: "",
    })
    setDescriptionLength(0)
    if (logoPreview) URL.revokeObjectURL(logoPreview)
    if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    setLogoPreview(null)
    setBannerPreview(null)
  setLogoFile(null)
  setBannerFile(null)
    onClose()
  }

  const triggerLogoInput = () => logoInputRef.current?.click()
  const triggerBannerInput = () => bannerInputRef.current?.click()

  const onDropLogo = (file?: File) => handleFileChange('logo', file)
  const onDropBanner = (file?: File) => handleFileChange('banner', file)

  const removeLogo = () => handleFileChange('logo', undefined)
  const removeBanner = () => handleFileChange('banner', undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      alert("Vui lòng hoàn thành đầy đủ thông tin bắt buộc trước khi gửi.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = new window.FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) payload.append(k, String(v))
      })
      payload.set("employee", String(Number.parseInt(formData.employee || "0")))
      if (logoFile) payload.append("logo", logoFile, logoFile.name)
      if (bannerFile) payload.append("banner", bannerFile, bannerFile.name)

      const response = await fetch("http://localhost:8080/api/company/11/company-info", {
        method: "POST",
        body: payload,
      })

      if (response.ok) {
        alert("🎉 Đăng ký thông tin công ty thành công!")
        handleCancel()
      } else {
        const err = await response.json().catch(() => null)
        alert(`❌ Lỗi: ${err?.message || "Có lỗi xảy ra"}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("❌ Có lỗi xảy ra khi gửi thông tin")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="crm-overlay">
      <div className="crm-center">
        <div className="crm-modal">
          <div className="crm-header">
            <div className="crm-header-top">
              <div className="crm-brand">
                <div className="crm-brand-icon"><Building2 /></div>
                <div>
                  <h2 className="crm-title">Đăng ký thông tin công ty</h2>
                  <p className="crm-sub">Tạo hồ sơ công ty chuyên nghiệp trên JobBox</p>
                </div>
              </div>
              <button onClick={handleCancel} className="crm-close"><X /></button>
            </div>

            {/* single-step flow: no step tracker */}
          </div>

          <div className="crm-body">
            <div className="crm-preview">
              <div className="crm-preview-inner">
                <h3 className="crm-preview-title">Xem trước hồ sơ</h3>

                <div className="crm-banner">
                  {bannerPreview ? (
                    <Image src={bannerPreview || '/placeholder.svg'} alt="Banner preview" fill className="crm-banner-img" />
                  ) : (
                    <div className="crm-banner-empty">
                      <ImageIcon />
                      <span>Banner công ty</span>
                    </div>
                  )}
                </div>

                <div className="crm-logo-row">
                  <div className="crm-logo">
                    {logoPreview ? (
                      <Image src={logoPreview || '/placeholder.svg'} alt="Logo preview" width={160} height={160} className="crm-logo-img" />
                    ) : (
                      <Building2 />
                    )}
                  </div>
                  <div className="crm-meta">
                    <h4 className="crm-company">{formData.companyName || 'Tên công ty'}</h4>
                    <p className="crm-industry">{formData.industry || 'Ngành nghề'}</p>
                    <p className="crm-location"><MapPin /> <span>{formData.location || 'Vị trí'}</span></p>
                  </div>
                </div>

                <div className="crm-note">💡 Hồ sơ công ty sẽ được hiển thị sau khi được duyệt bởi admin</div>
              </div>
            </div>

            <div className="crm-form-panel">
              <form onSubmit={handleSubmit} className="crm-form">
                <div className="crm-form-scroll">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                      <div className="p-4 sm:p-6 border-b border-gray-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          Thông tin công ty
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Nhập thông tin công ty và tải lên hình ảnh</p>
                      </div>
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          {/* left & right columns (inputs and uploads) */}
                          <div className="space-y-2">
                            <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700">Tên công ty *</label>
                            <input id="companyName" type="text" value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} placeholder="Nhập tên công ty" required className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base" />
                            <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mt-3">Ngành nghề *</label>
                            <input id="industry" type="text" value={formData.industry} onChange={(e) => handleInputChange("industry", e.target.value)} placeholder="CNTT, Tài chính, Y tế..." required className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base" />
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mt-3">Mô tả ngắn gọn</label>
                            <textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Một vài câu giới thiệu về công ty" className="w-full h-20 sm:h-24 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base resize-none" />
                            <div className="text-xs text-gray-500 text-right">{descriptionLength} / 200 ký tự</div>
                          </div>

                          <div>
                            <label htmlFor="employee" className="block text-sm font-semibold text-gray-700">Số lượng nhân viên *</label>
                            <input id="employee" type="number" min="1" value={formData.employee} onChange={(e) => handleInputChange("employee", e.target.value)} placeholder="Ví dụ: 50" required className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base" />
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mt-3">Email liên hệ *</label>
                            <input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="contact@company.com" required className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base" />
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mt-3">Số điện thoại *</label>
                            <input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="0123 456 789" required className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base" />
                            <label htmlFor="foundedYear" className="block text-sm font-semibold text-gray-700 mt-3">Năm thành lập</label>
                            <input id="foundedYear" type="text" value={formData.foundedYear} onChange={(e) => handleInputChange("foundedYear", e.target.value)} placeholder="Nhập năm thành lập công ty" className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base" />

                            <div className="crm-upload-grid mt-4">
                              <div className="crm-upload-card">
                                <input ref={logoInputRef} type="file" accept="image/*" className="crm-file-input-hidden" onChange={(e) => onDropLogo(e.target.files?.[0])} />
                                {logoPreview ? (
                                  <div className="crm-upload-preview-card">
                                    <Image src={logoPreview} alt="logo" width={120} height={120} unoptimized className="crm-upload-preview-img" />
                                    <button type="button" onClick={removeLogo} className="crm-upload-remove">✕</button>
                                  </div>
                                ) : (
                                  <button type="button" onClick={triggerLogoInput} className="crm-upload-placeholder">Thêm logo</button>
                                )}
                              </div>

                              <div className="crm-upload-card">
                                <input ref={bannerInputRef} type="file" accept="image/*" className="crm-file-input-hidden" onChange={(e) => onDropBanner(e.target.files?.[0])} />
                                {bannerPreview ? (
                                  <div className="crm-upload-preview-card banner">
                                    <Image src={bannerPreview} alt="banner" width={360} height={120} unoptimized className="crm-upload-preview-img" />
                                    <button type="button" onClick={removeBanner} className="crm-upload-remove">✕</button>
                                  </div>
                                ) : (
                                  <button type="button" onClick={triggerBannerInput} className="crm-upload-placeholder">Thêm banner</button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="crm-footer">
                    <button type="button" onClick={handleCancel} className="crm-btn">Hủy</button>
                    <button type="submit" className={`crm-btn ${isValid && !isSubmitting ? 'primary' : 'disabled'}`} disabled={!isValid || isSubmitting}>
                      {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
