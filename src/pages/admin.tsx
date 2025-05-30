import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dictionary } from '@/types/dictionary';
import AdminAuth from '@/components/AdminAuth';

export default function AdminPage() {
  const [enData, setEnData] = useState<Dictionary | null>(null);
  const [arData, setArData] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  const [imageStates, setImageStates] = useState<Record<string, boolean>>({});

  // Load current data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [enRes, arRes] = await Promise.all([
          fetch('/api/admin/content?locale=en'),
          fetch('/api/admin/content?locale=ar')
        ]);
        
        if (enRes.ok && arRes.ok) {
          const enContent = await enRes.json();
          const arContent = await arRes.json();
          setEnData(enContent);
          setArData(arContent);
        } else {
          setMessage('Failed to load content. API response not ok.');
        }
      } catch (error) {
        console.error('Failed to load content:', error);
        setMessage('Failed to load content. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Check if image exists
  const checkImageExists = async (imagePath: string): Promise<boolean> => {
    try {
      const response = await fetch(imagePath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Load image states for a case
  const loadImageStates = useCallback(async (caseId: number) => {
    const beforeImages = [1, 2, 3].map(i => `/images/gallery/case${caseId}/before-${i}.jpg`);
    const afterImages = [1, 2, 3].map(i => `/images/gallery/case${caseId}/after-${i}.jpg`);
    const allImages = [...beforeImages, ...afterImages];

    const states: Record<string, boolean> = {};
    for (const imagePath of allImages) {
      states[imagePath] = await checkImageExists(imagePath);
    }
    
    setImageStates(prev => ({ ...prev, ...states }));
  }, []);

  // Get available images for a case
  const getAvailableImages = (caseId: number) => {
    const beforeImages = [1, 2, 3]
      .map(i => `/images/gallery/case${caseId}/before-${i}.jpg`)
      .filter(path => imageStates[path]);
    const afterImages = [1, 2, 3]
      .map(i => `/images/gallery/case${caseId}/after-${i}.jpg`)
      .filter(path => imageStates[path]);
    
    return { beforeImages, afterImages };
  };

  // Load image states when gallery tab is activated
  useEffect(() => {
    if (activeTab === 'gallery' && enData?.pages?.gallery?.cases) {
      enData.pages.gallery.cases.forEach((caseItem: { id: number }) => {
        loadImageStates(caseItem.id);
      });
    }
  }, [activeTab, enData?.pages?.gallery?.cases, loadImageStates]);

  // Add new service
  const addService = () => {
    if (!enData || !arData) return;

    const newService = "New Service";
    const newDescription = "Service description";
    const newArService = "خدمة جديدة";
    const newArDescription = "وصف الخدمة";

    setEnData({
      ...enData,
      pages: {
        ...enData.pages,
        services: {
          ...enData.pages?.services,
          services_list: [...(enData.pages?.services?.services_list || []), newService],
          descriptions: [...(enData.pages?.services?.descriptions || []), newDescription]
        }
      }
    });

    setArData({
      ...arData,
      pages: {
        ...arData.pages,
        services: {
          ...arData.pages?.services,
          services_list: [...(arData.pages?.services?.services_list || []), newArService],
          descriptions: [...(arData.pages?.services?.descriptions || []), newArDescription]
        }
      }
    });
  };

  // Update service
  const updateService = (index: number, locale: 'en' | 'ar', field: 'title' | 'description', value: string) => {
    const data = locale === 'en' ? enData : arData;
    const setData = locale === 'en' ? setEnData : setArData;
    
    if (!data) return;

    const updatedServices = [...(data.pages?.services?.services_list || [])];
    const updatedDescriptions = [...(data.pages?.services?.descriptions || [])];

    if (field === 'title') {
      updatedServices[index] = value;
    } else {
      updatedDescriptions[index] = value;
    }

    setData({
      ...data,
      pages: {
        ...data.pages,
        services: {
          ...data.pages?.services,
          services_list: updatedServices,
          descriptions: updatedDescriptions
        }
      }
    });
  };

  // Delete service
  const deleteService = (index: number) => {
    if (!enData || !arData) return;

    setEnData({
      ...enData,
      pages: {
        ...enData.pages,
        services: {
          ...enData.pages?.services,
          services_list: (enData.pages?.services?.services_list || []).filter((_, i) => i !== index),
          descriptions: (enData.pages?.services?.descriptions || []).filter((_, i) => i !== index)
        }
      }
    });

    setArData({
      ...arData,
      pages: {
        ...arData.pages,
        services: {
          ...arData.pages?.services,
          services_list: (arData.pages?.services?.services_list || []).filter((_, i) => i !== index),
          descriptions: (arData.pages?.services?.descriptions || []).filter((_, i) => i !== index)
        }
      }
    });
  };

  // Update About section
  const updateAbout = (locale: 'en' | 'ar', field: 'title' | 'mission', value: string) => {
    const data = locale === 'en' ? enData : arData;
    const setData = locale === 'en' ? setEnData : setArData;
    
    if (!data) return;

    setData({
      ...data,
      pages: {
        ...data.pages,
        about: {
          ...data.pages?.about,
          [field]: value
        }
      }
    });
  };

  // Update Contact information
  const updateContact = (locale: 'en' | 'ar', field: 'email' | 'phone' | 'address', value: string) => {
    const data = locale === 'en' ? enData : arData;
    const setData = locale === 'en' ? setEnData : setArData;
    
    if (!data) return;

    setData({
      ...data,
      pages: {
        ...data.pages,
        contact: {
          ...data.pages?.contact,
          [field]: value
        }
      }
    });
  };

  // Update SEO information
  const updateSEO = (locale: 'en' | 'ar', field: 'title' | 'description' | 'keywords', value: string) => {
    const data = locale === 'en' ? enData : arData;
    const setData = locale === 'en' ? setEnData : setArData;
    
    if (!data) return;

    setData({
      ...data,
      seo: {
        title: data.seo?.title || '',
        description: data.seo?.description || '',
        keywords: data.seo?.keywords || '',
        siteName: data.seo?.siteName || '',
        ...data.seo,
        [field]: value
      }
    });
  };

  // Add new gallery case
  const addGalleryCase = () => {
    if (!enData || !arData) return;

    const newId = Math.max(...(enData.pages?.gallery?.cases?.map(c => c.id) || [0])) + 1;
    
    const newCase = {
      id: newId,
      title: "New Case",
      photos: [
        { description: "Front view" },
        { description: "Side view" }
      ]
    };

    const newArCase = {
      id: newId,
      title: "حالة جديدة",
      photos: [
        { description: "المنظر الأمامي" },
        { description: "المنظر الجانبي" }
      ]
    };

    setEnData({
      ...enData,
      pages: {
        ...enData.pages,
        gallery: {
          ...enData.pages?.gallery,
          cases: [...(enData.pages?.gallery?.cases || []), newCase]
        }
      }
    });

    setArData({
      ...arData,
      pages: {
        ...arData.pages,
        gallery: {
          ...arData.pages?.gallery,
          cases: [...(arData.pages?.gallery?.cases || []), newArCase]
        }
      }
    });
  };

  // Update gallery case
  const updateGalleryCase = (caseId: number, locale: 'en' | 'ar', field: 'title', value: string) => {
    const data = locale === 'en' ? enData : arData;
    const setData = locale === 'en' ? setEnData : setArData;
    
    if (!data) return;

    const updatedCases = (data.pages?.gallery?.cases || []).map(caseItem => 
      caseItem.id === caseId ? { ...caseItem, [field]: value } : caseItem
    );

    setData({
      ...data,
      pages: {
        ...data.pages,
        gallery: {
          ...data.pages?.gallery,
          cases: updatedCases
        }
      }
    });
  };

  // Delete gallery case
  const deleteGalleryCase = (caseId: number) => {
    if (!enData || !arData) return;

    setEnData({
      ...enData,
      pages: {
        ...enData.pages,
        gallery: {
          ...enData.pages?.gallery,
          cases: (enData.pages?.gallery?.cases || []).filter(c => c.id !== caseId)
        }
      }
    });

    setArData({
      ...arData,
      pages: {
        ...arData.pages,
        gallery: {
          ...arData.pages?.gallery,
          cases: (arData.pages?.gallery?.cases || []).filter(c => c.id !== caseId)
        }
      }
    });
  };

  // Add photo to gallery case
  const addPhotoToCase = (caseId: number) => {
    if (!enData || !arData) return;

    const updateCasePhotos = (data: Dictionary, setData: (data: Dictionary) => void, description: string) => {
      const updatedCases = (data.pages?.gallery?.cases || []).map(caseItem => 
        caseItem.id === caseId 
          ? { ...caseItem, photos: [...caseItem.photos, { description }] }
          : caseItem
      );

      setData({
        ...data,
        pages: {
          ...data.pages,
          gallery: {
            ...data.pages?.gallery,
            cases: updatedCases
          }
        }
      });
    };

    updateCasePhotos(enData, setEnData, "New photo");
    updateCasePhotos(arData, setArData, "صورة جديدة");
  };

  // Update photo description
  const updatePhotoDescription = (caseId: number, photoIndex: number, locale: 'en' | 'ar', value: string) => {
    const data = locale === 'en' ? enData : arData;
    const setData = locale === 'en' ? setEnData : setArData;
    
    if (!data) return;

    const updatedCases = (data.pages?.gallery?.cases || []).map(caseItem => {
      if (caseItem.id === caseId) {
        const updatedPhotos = [...caseItem.photos];
        updatedPhotos[photoIndex] = { ...updatedPhotos[photoIndex], description: value };
        return { ...caseItem, photos: updatedPhotos };
      }
      return caseItem;
    });

    setData({
      ...data,
      pages: {
        ...data.pages,
        gallery: {
          ...data.pages?.gallery,
          cases: updatedCases
        }
      }
    });
  };

  // Delete photo from case
  const deletePhotoFromCase = (caseId: number, photoIndex: number) => {
    if (!enData || !arData) return;

    const updateCasePhotos = (data: Dictionary, setData: (data: Dictionary) => void) => {
      const updatedCases = (data.pages?.gallery?.cases || []).map(caseItem => 
        caseItem.id === caseId 
          ? { ...caseItem, photos: caseItem.photos.filter((_: unknown, i: number) => i !== photoIndex) }
          : caseItem
      );

      setData({
        ...data,
        pages: {
          ...data.pages,
          gallery: {
            ...data.pages?.gallery,
            cases: updatedCases
          }
        }
      });
    };

    updateCasePhotos(enData, setEnData);
    updateCasePhotos(arData, setArData);
  };

  // Add new FAQ
  const addFAQ = () => {
    if (!enData || !arData) return;

    const newFAQ = {
      question: "New Question",
      answer: "New Answer"
    };

    const newArFAQ = {
      question: "سؤال جديد",
      answer: "جواب جديد"
    };

    setEnData({
      ...enData,
      pages: {
        ...enData.pages,
        faq: {
          ...enData.pages?.faq,
          questions: [...(enData.pages?.faq?.questions || []), newFAQ]
        }
      }
    });

    setArData({
      ...arData,
      pages: {
        ...arData.pages,
        faq: {
          ...arData.pages?.faq,
          questions: [...(arData.pages?.faq?.questions || []), newArFAQ]
        }
      }
    });
  };

  // Update FAQ
  const updateFAQ = (index: number, locale: 'en' | 'ar', field: 'question' | 'answer', value: string) => {
    const data = locale === 'en' ? enData : arData;
    const setData = locale === 'en' ? setEnData : setArData;
    
    if (!data) return;

    const updatedQuestions = [...(data.pages?.faq?.questions || [])];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };

    setData({
      ...data,
      pages: {
        ...data.pages,
        faq: {
          ...data.pages?.faq,
          questions: updatedQuestions
        }
      }
    });
  };

  // Delete FAQ
  const deleteFAQ = (index: number) => {
    if (!enData || !arData) return;

    setEnData({
      ...enData,
      pages: {
        ...enData.pages,
        faq: {
          ...enData.pages?.faq,
          questions: (enData.pages?.faq?.questions || []).filter((_, i) => i !== index)
        }
      }
    });

    setArData({
      ...arData,
      pages: {
        ...arData.pages,
        faq: {
          ...arData.pages?.faq,
          questions: (arData.pages?.faq?.questions || []).filter((_, i) => i !== index)
        }
      }
    });
  };

  // Save changes
  const saveChanges = async () => {
    if (!enData || !arData) return;
    
    setSaving(true);
    try {
      const [enRes, arRes] = await Promise.all([
        fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: 'en', data: enData })
        }),
        fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: 'ar', data: arData })
        })
      ]);

      if (enRes.ok && arRes.ok) {
        setMessage('✅ Content saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to save content');
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage('❌ Save failed. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading admin panel...</div>
      </div>
    );
  }

  if (!enData || !arData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Failed to load content</div>
      </div>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Content Management Admin
            </h1>
            <div className="flex gap-4">
              <button
                onClick={saveChanges}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Back to Site
              </Link>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button 
                  onClick={() => setActiveTab('faq')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'faq' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  FAQ Management
                </button>
                <button 
                  onClick={() => setActiveTab('services')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'services' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Services
                </button>
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'about' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  About
                </button>
                <button 
                  onClick={() => setActiveTab('contact')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'contact' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Contact
                </button>
                <button 
                  onClick={() => setActiveTab('gallery')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'gallery' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gallery
                </button>
                <button 
                  onClick={() => setActiveTab('seo')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'seo' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  SEO
                </button>
              </nav>
            </div>
          </div>

          {/* FAQ Management */}
          {activeTab === 'faq' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                FAQ Management
              </h2>
              <button
                onClick={addFAQ}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                + Add New FAQ
              </button>
            </div>

            <div className="space-y-6">
              {(enData.pages?.faq?.questions || []).map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      FAQ #{index + 1}
                    </h3>
                    <button
                      onClick={() => deleteFAQ(index)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* English */}
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2">English</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Question
                          </label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFAQ(index, 'en', 'question', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Answer
                          </label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFAQ(index, 'en', 'answer', e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Arabic */}
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2">Arabic</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            السؤال
                          </label>
                          <input
                            type="text"
                            value={arData.pages?.faq?.questions?.[index]?.question || ''}
                            onChange={(e) => updateFAQ(index, 'ar', 'question', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            الجواب
                          </label>
                          <textarea
                            value={arData.pages?.faq?.questions?.[index]?.answer || ''}
                            onChange={(e) => updateFAQ(index, 'ar', 'answer', e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Services Management */}
          {activeTab === 'services' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Services Management
              </h2>
              <button
                onClick={addService}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                + Add New Service
              </button>
            </div>

            <div className="space-y-6">
              {(enData.pages?.services?.services_list || []).map((service: string, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      Service #{index + 1}
                    </h3>
                    <button
                      onClick={() => deleteService(index)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* English */}
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2">English</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Service Title
                          </label>
                          <input
                            type="text"
                            value={service}
                            onChange={(e) => updateService(index, 'en', 'title', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Service Description
                          </label>
                          <textarea
                            value={enData.pages?.services?.descriptions?.[index] || ''}
                            onChange={(e) => updateService(index, 'en', 'description', e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Arabic */}
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2">Arabic</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            عنوان الخدمة
                          </label>
                          <input
                            type="text"
                            value={arData.pages?.services?.services_list?.[index] || ''}
                            onChange={(e) => updateService(index, 'ar', 'title', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            وصف الخدمة
                          </label>
                          <textarea
                            value={arData.pages?.services?.descriptions?.[index] || ''}
                            onChange={(e) => updateService(index, 'ar', 'description', e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* About Section Management */}
          {activeTab === 'about' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                About Section
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-600 mb-2">English</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={enData.pages?.about?.title || ''}
                      onChange={(e) => updateAbout('en', 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Mission</label>
                    <textarea
                      value={enData.pages?.about?.mission || ''}
                      onChange={(e) => updateAbout('en', 'mission', e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-600 mb-2">Arabic</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">العنوان</label>
                    <input
                      type="text"
                      value={arData.pages?.about?.title || ''}
                      onChange={(e) => updateAbout('ar', 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">المهمة</label>
                    <textarea
                      value={arData.pages?.about?.mission || ''}
                      onChange={(e) => updateAbout('ar', 'mission', e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Contact Information */}
          {activeTab === 'contact' && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-600 mb-2">English</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="text"
                      value={enData.pages?.contact?.email || ''}
                      onChange={(e) => updateContact('en', 'email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                    <input
                      type="text"
                      value={enData.pages?.contact?.phone || ''}
                      onChange={(e) => updateContact('en', 'phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <input
                      type="text"
                      value={enData.pages?.contact?.address || ''}
                      onChange={(e) => updateContact('en', 'address', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-600 mb-2">Arabic</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">البريد الإلكتروني</label>
                    <input
                      type="text"
                      value={arData.pages?.contact?.email || ''}
                      onChange={(e) => updateContact('ar', 'email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">الهاتف</label>
                    <input
                      type="text"
                      value={arData.pages?.contact?.phone || ''}
                      onChange={(e) => updateContact('ar', 'phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">العنوان</label>
                    <input
                      type="text"
                      value={arData.pages?.contact?.address || ''}
                      onChange={(e) => updateContact('ar', 'address', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Gallery Management */}
          {activeTab === 'gallery' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Gallery Management
              </h2>
              <button
                onClick={addGalleryCase}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                + Add New Case
              </button>
            </div>

            <div className="space-y-8">
              {(enData.pages?.gallery?.cases || []).map((caseItem: { id: number; title: string; photos: { description: string }[] }) => (
                <div key={caseItem.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      Case #{caseItem.id}
                    </h3>
                    <button
                      onClick={() => deleteGalleryCase(caseItem.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete Case
                    </button>
                  </div>

                  {/* Case Title */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2">English Title</h4>
                      <input
                        type="text"
                        value={caseItem.title}
                        onChange={(e) => updateGalleryCase(caseItem.id, 'en', 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2">Arabic Title</h4>
                      <input
                        type="text"
                        value={arData.pages?.gallery?.cases?.find((c: { id: number; title: string }) => c.id === caseItem.id)?.title || ''}
                        onChange={(e) => updateGalleryCase(caseItem.id, 'ar', 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Photos */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-600">Photos</h4>
                      <button
                        onClick={() => addPhotoToCase(caseItem.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        + Add Photo
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {caseItem.photos.map((photo: { description: string }, photoIndex: number) => (
                        <div key={photoIndex} className="border border-gray-100 rounded p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-600">Photo #{photoIndex + 1}</span>
                            <button
                              onClick={() => deletePhotoFromCase(caseItem.id, photoIndex)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                English Description
                              </label>
                              <input
                                type="text"
                                value={photo.description}
                                onChange={(e) => updatePhotoDescription(caseItem.id, photoIndex, 'en', e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Arabic Description
                              </label>
                              <input
                                type="text"
                                value={arData.pages?.gallery?.cases?.find((c: { id: number; photos: { description: string }[] }) => c.id === caseItem.id)?.photos?.[photoIndex]?.description || ''}
                                onChange={(e) => updatePhotoDescription(caseItem.id, photoIndex, 'ar', e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                dir="rtl"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image Preview Section */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-600">Image Preview & Status</h4>
                      <button
                        onClick={() => loadImageStates(caseItem.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                      >
                        🔄 Refresh Images
                      </button>
                    </div>

                    {(() => {
                      const { beforeImages, afterImages } = getAvailableImages(caseItem.id);

                      return (
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Before Images */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                              📸 Before Images
                              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {beforeImages.length} found
                              </span>
                            </h5>
                            <div className="space-y-2">
                              {[1, 2, 3].map(i => {
                                const imagePath = `/images/gallery/case${caseItem.id}/before-${i}.jpg`;
                                const exists = imageStates[imagePath];
                                return (
                                  <div key={i} className="flex items-center space-x-3 p-2 border rounded">
                                    <div className={`w-3 h-3 rounded-full ${exists ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-mono">before-{i}.jpg</span>
                                    {exists && (
                                      <div className="ml-auto">
                                        <Image
                                          src={imagePath}
                                          alt={`Before ${i}`}
                                          width={60}
                                          height={45}
                                          className="rounded object-cover"
                                          onError={() => setImageStates(prev => ({ ...prev, [imagePath]: false }))}
                                        />
                                      </div>
                                    )}
                                    {!exists && (
                                      <span className="ml-auto text-xs text-red-600">Missing</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* After Images */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                              ✨ After Images
                              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                {afterImages.length} found
                              </span>
                            </h5>
                            <div className="space-y-2">
                              {[1, 2, 3].map(i => {
                                const imagePath = `/images/gallery/case${caseItem.id}/after-${i}.jpg`;
                                const exists = imageStates[imagePath];
                                return (
                                  <div key={i} className="flex items-center space-x-3 p-2 border rounded">
                                    <div className={`w-3 h-3 rounded-full ${exists ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-mono">after-{i}.jpg</span>
                                    {exists && (
                                      <div className="ml-auto">
                                        <Image
                                          src={imagePath}
                                          alt={`After ${i}`}
                                          width={60}
                                          height={45}
                                          className="rounded object-cover"
                                          onError={() => setImageStates(prev => ({ ...prev, [imagePath]: false }))}
                                        />
                                      </div>
                                    )}
                                    {!exists && (
                                      <span className="ml-auto text-xs text-red-600">Missing</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* File Upload Instructions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="font-medium text-yellow-800 mb-2">📁 File Organization</h5>
                    <p className="text-sm text-yellow-700 mb-2">
                      To add images for this case, create the following directory structure:
                    </p>
                    <code className="block bg-yellow-100 p-2 rounded text-xs font-mono">
                      /public/images/gallery/case{caseItem.id}/
                      ├── before-1.jpg
                      ├── before-2.jpg
                      ├── after-1.jpg
                      └── after-2.jpg
                    </code>
                    <p className="text-xs text-yellow-600 mt-2">
                      Files should be named: before-[number].jpg and after-[number].jpg
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Image exists</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">Image missing</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* SEO Management */}
          {activeTab === 'seo' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                SEO Settings
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-600 mb-2">English SEO</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Page Title</label>
                    <input
                      type="text"
                      value={enData?.seo?.title || ''}
                      onChange={(e) => updateSEO('en', 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={enData?.seo?.description || ''}
                      onChange={(e) => updateSEO('en', 'description', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Keywords</label>
                    <input
                      type="text"
                      value={enData?.seo?.keywords || ''}
                      onChange={(e) => updateSEO('en', 'keywords', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-600 mb-2">Arabic SEO</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">عنوان الصفحة</label>
                    <input
                      type="text"
                      value={arData?.seo?.title || ''}
                      onChange={(e) => updateSEO('ar', 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">الوصف</label>
                    <textarea
                      value={arData?.seo?.description || ''}
                      onChange={(e) => updateSEO('ar', 'description', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">الكلمات المفتاحية</label>
                    <input
                      type="text"
                      value={arData?.seo?.keywords || ''}
                      onChange={(e) => updateSEO('ar', 'keywords', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {enData.pages?.faq?.questions?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Total FAQs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {enData.pages?.services?.services_list?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Services</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {enData.pages?.gallery?.cases?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Gallery Cases</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">Languages</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">💡 Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always fill both English and Arabic versions</li>
              <li>• Click &quot;Save Changes&quot; after making edits</li>
              <li>• Changes take effect immediately on the live site</li>
              <li>• For complex changes, consider editing JSON files directly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </AdminAuth>
  );
}