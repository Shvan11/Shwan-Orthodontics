'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Dictionary } from '@/types/dictionary';
import { ContentManager, subscribeToContentChanges } from '../../../lib/supabase';
import AdminAuth from '@/components/AdminAuth';

export default function AdminSupabasePage() {
  const [enData, setEnData] = useState<Dictionary | null>(null);
  const [arData, setArData] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  const [isOnline, setIsOnline] = useState(true);

  // Load data from Supabase
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [enContent, arContent] = await Promise.all([
        ContentManager.getFullContent('en'),
        ContentManager.getFullContent('ar')
      ]);
      
      setEnData(enContent as unknown as Dictionary);
      setArData(arContent as unknown as Dictionary);
      setMessage('✅ Content loaded from Supabase successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to load content:', error);
      setMessage('❌ Failed to load content from database. Check console for details.');
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Set up real-time subscriptions
  useEffect(() => {
    const subscription = subscribeToContentChanges((payload) => {
      console.log('Real-time update received:', payload);
      setMessage('🔄 Content updated by another user, refreshing...');
      setTimeout(() => {
        loadData();
      }, 1000);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadData]);

  // Save changes to Supabase
  const saveChanges = useCallback(async () => {
    if (!enData || !arData) return;
    
    setSaving(true);
    try {
      await Promise.all([
        fetch('/api/admin/supabase', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: 'en', data: enData })
        }),
        fetch('/api/admin/supabase', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: 'ar', data: arData })
        })
      ]);

      setMessage('✅ Content saved to Supabase successfully! Changes are live!');
      setIsOnline(true);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage('❌ Save failed. Check console for details.');
      setIsOnline(false);
    } finally {
      setSaving(false);
    }
  }, [enData, arData]);

  // Update functions for different content types
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

  // Auto-save functionality (optional)
  const [autoSave, setAutoSave] = useState(false);
  useEffect(() => {
    if (autoSave && (enData || arData) && !loading) {
      const timeoutId = setTimeout(() => {
        saveChanges();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [enData, arData, autoSave, loading, saveChanges]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Loading from Supabase...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!enData || !arData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Failed to load content from Supabase</div>
          <button 
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Supabase CMS Admin
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className={`flex items-center space-x-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">{isOnline ? 'Connected to Supabase' : 'Connection Failed'}</span>
                </div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded"
                  />
                  <span>Auto-save</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={saveChanges}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
              >
                {saving ? 'Saving to Cloud...' : '☁️ Save to Supabase'}
              </button>
              <button
                onClick={loadData}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                🔄 Refresh
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
              message.includes('✅') ? 'bg-green-100 text-green-800' : 
              message.includes('🔄') ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Rest of the admin interface */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">🚀 Supabase Integration Active</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Changes save instantly to the cloud database</li>
              <li>• Real-time updates from other editors</li>
              <li>• Automatic backups and version control</li>
              <li>• No rebuilding required - changes go live immediately</li>
            </ul>
          </div>

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
                  FAQ Management (Supabase)
                </h2>
                <button
                  onClick={addFAQ}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  + Add New FAQ
                </button>
              </div>

              <div className="space-y-6">
                {(enData.pages?.faq?.questions || []).map((faq: { question: string; answer: string }, index: number) => (
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
                  Services Management (Supabase)
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
                  About Section (Supabase)
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
                Contact Information (Supabase)
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

          {/* SEO Management */}
          {activeTab === 'seo' && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  SEO Settings (Supabase)
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
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
              <li>• Click &quot;Save to Supabase&quot; after making edits</li>
              <li>• Changes are saved to the cloud and sync across devices</li>
              <li>• Use auto-save to automatically save your changes</li>
              <li>• Real-time updates notify you when others make changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </AdminAuth>
  );
}