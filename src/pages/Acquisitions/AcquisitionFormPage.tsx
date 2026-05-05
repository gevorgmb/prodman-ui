import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { acquisitionApi, type AcquisitionItem, type StoreAcquisitionRequest, type UpdateAcquisitionRequest } from '../../api/services/acquisition.api';
import { productApi, type Product } from '../../api/services/product.api';
import Button from '../../components/UI/Button';
import { ArrowLeft, Save, Plus, Trash2, Pencil, ShoppingCart, Calendar, Tag, DollarSign, Hash } from 'lucide-react';

interface LocalItem extends Partial<AcquisitionItem> {
  id: number; // For new items, we'll use negative IDs or a temporary tracker
  tempId?: number;
  productId: number | null;
  productName: string;
  description: string | null;
  expirationDate: string | null;
  quantity: number;
  price: number;
  action?: 'create' | 'update' | 'delete' | null;
}

interface ItemFormData {
  productId: number | null;
  productName: string;
  description: string;
  expirationDate: string;
  quantity: string;
  price: string;
}

const AcquisitionFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'complete' | 'cancelled'>('draft');
  const [items, setItems] = useState<LocalItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<{
    storeName: string;
    description: string;
    status: 'draft' | 'complete' | 'cancelled';
  } | null>(null);

  // Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<LocalItem | null>(null);
  const [itemFormData, setItemFormData] = useState<ItemFormData>({
    productId: null,
    productName: '',
    description: '',
    expirationDate: '',
    quantity: '1',
    price: '0',
  });

  const dateInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const prodData = await productApi.getProducts();
      setProducts(prodData.products);

      if (isEdit) {
        const { acquisition } = await acquisitionApi.getAcquisition(parseInt(id));
        setStoreName(acquisition.storeName);
        setDescription(acquisition.description || '');
        setStatus(acquisition.status);
        setInitialData({
          storeName: acquisition.storeName,
          description: acquisition.description || '',
          status: acquisition.status
        });

        const itemsData = await acquisitionApi.getAcquisitionItems(parseInt(id));
        setItems(itemsData.items.map(item => ({ ...item, action: null })));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSaving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isSaving]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !isSaving && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const proceed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (proceed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEdit) {
        const payload: UpdateAcquisitionRequest = {};

        const modifiedItems = items.filter(item => item.action).map(item => ({
          action: item.action!,
          itemId: item.id > 0 ? item.id : null,
          productId: item.productId,
          productName: item.productName,
          description: item.description,
          expirationDate: item.expirationDate,
          quantity: item.quantity,
          price: item.price,
        }));

        if (modifiedItems.length > 0) {
          payload.items = modifiedItems;
        }

        // Only add changed fields to payload
        if (storeName !== initialData?.storeName) payload.storeName = storeName;
        if (description !== initialData?.description) payload.description = description;
        if (status !== initialData?.status) payload.status = status;

        await acquisitionApi.updateAcquisition(parseInt(id), payload);
      } else {
        const payload: StoreAcquisitionRequest = {
          storeName,
          description,
          status: status as any,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            description: item.description,
            expirationDate: item.expirationDate,
            quantity: item.quantity,
            price: item.price,
          })),
        };
        await acquisitionApi.createAcquisition(payload);
      }
      navigate('/acquisitions');
    } catch (error) {
      console.error('Failed to save acquisition:', error);
      setIsSaving(false);
    }
  };

  const handleOpenItemModal = (item: LocalItem | null = null) => {
    if (item) {
      setCurrentItem(item);
      setItemFormData({
        productId: item.productId,
        productName: item.productName,
        description: item.description || '',
        expirationDate: item.expirationDate ? item.expirationDate.split('T')[0] : '',
        quantity: item.quantity.toString(),
        price: item.price.toString(),
      });
    } else {
      setCurrentItem(null);
      setItemFormData({
        productId: null,
        productName: '',
        description: '',
        expirationDate: '',
        quantity: '1',
        price: '0',
      });
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (currentItem) {
      // Update existing item in local state
      setItems(prev => prev.map(item =>
        (item.id === currentItem.id && item.id !== 0) || (item.tempId === currentItem.tempId && item.tempId !== undefined)
          ? { ...item, ...itemFormData, quantity: parseFloat(itemFormData.quantity) || 0, price: parseFloat(itemFormData.price) || 0, action: item.id > 0 ? 'update' : 'create' }
          : item
      ));
      setIsDirty(true);
    } else {
      // Add new item to local state
      const newItem: LocalItem = {
        ...itemFormData,
        quantity: parseFloat(itemFormData.quantity) || 0,
        price: parseFloat(itemFormData.price) || 0,
        id: -Date.now(), // Temporary negative ID
        tempId: Date.now(),
        action: 'create',
      };
      setItems(prev => [...prev, newItem]);
      setIsDirty(true);
    }
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (itemToDelete: LocalItem) => {
    if (itemToDelete.id > 0) {
      // Mark for deletion in backend
      setItems(prev => prev.map(item =>
        item.id === itemToDelete.id ? { ...item, action: 'delete' } : item
      ));
      setIsDirty(true);
    } else {
      // Just remove from local state
      setItems(prev => prev.filter(item => item.tempId !== itemToDelete.tempId));
      setIsDirty(true);
    }
  };

  const activeItems = items.filter(item => item.action !== 'delete');
  const totalPrice = activeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (isLoading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Button variant="ghost" onClick={() => navigate('/acquisitions')} style={{ padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
            {isEdit ? 'Edit Acquisition' : 'New Acquisition'}
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            {isEdit ? `Editing acquisition #${id}` : 'Create a new purchase record'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Header Info */}
          <div style={{ backgroundColor: 'var(--card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={20} color="var(--primary)" />
              Basic Information
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Store Name</label>
              <input
                type="text" required
                value={storeName}
                onChange={(e) => { setStoreName(e.target.value); setIsDirty(true); }}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                placeholder="e.g. Walmart, Local Market..."
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)', resize: 'vertical' }}
                placeholder="Notes about this acquisition..."
              />
            </div>
          </div>

          {/* Status & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Status</label>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value as any); setIsDirty(true); }}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)', marginBottom: '1.5rem' }}
              >
                <option value="draft">Draft</option>
                <option value="complete">Complete</option>
                {isEdit && <option value="cancelled">Cancelled</option>}
              </select>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Total Items</span>
                  <span style={{ fontWeight: 600 }}>{activeItems.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button type="submit" style={{ width: '100%', padding: '1rem', gap: '0.5rem' }}>
              <Save size={20} />
              {isEdit ? 'Update Acquisition' : 'Create Acquisition'}
            </Button>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={20} color="var(--primary)" />
              Items
            </h2>
            <Button type="button" size="sm" variant="ghost" onClick={() => handleOpenItemModal()} style={{ gap: '0.5rem', color: 'var(--primary)' }}>
              <Plus size={18} />
              Add Item
            </Button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--muted)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Product</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Qty</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Total</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeItems.map((item, index) => (
                <tr key={item.id || item.tempId} style={{ borderTop: index === 0 ? 'none' : '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    {item.description && <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>{item.quantity}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleOpenItemModal(item)}>
                        <Pencil size={18} />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteItem(item)} style={{ color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeItems.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                    No items added yet. Click "Add Item" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>

      {/* Item Modal */}
      {isItemModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            backgroundColor: 'var(--card)',
            padding: '2.5rem',
            borderRadius: 'var(--radius)',
            width: '100%', maxWidth: '500px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{currentItem ? 'Edit Item' : 'Add New Item'}</h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Product</label>
              <select
                value={itemFormData.productId || ''}
                onChange={(e) => {
                  const pid = e.target.value ? parseInt(e.target.value) : null;
                  const p = products.find(p => p.id === pid);
                  setItemFormData({ ...itemFormData, productId: pid, productName: p ? p.name : '' });
                }}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              >
                <option value="">Select a product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {!itemFormData.productId && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Or enter custom name:</label>
                  <input
                    type="text"
                    value={itemFormData.productName}
                    onChange={(e) => setItemFormData({ ...itemFormData, productName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Quantity</label>
                <div style={{ position: 'relative' }}>
                  <Hash size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                  <input
                    type="number" step="0.01" required
                    value={itemFormData.quantity}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      let val = e.target.value;
                      // Remove leading zeros
                      if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
                        val = val.replace(/^0+/, '');
                        if (val === '' || val.startsWith('.')) val = '0' + val;
                      }
                      setItemFormData({ ...itemFormData, quantity: val });
                    }}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Price</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                  <input
                    type="number" step="0.01" required
                    value={itemFormData.price}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      let val = e.target.value;
                      // Remove leading zeros
                      if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
                        val = val.replace(/^0+/, '');
                        if (val === '' || val.startsWith('.')) val = '0' + val;
                      }
                      setItemFormData({ ...itemFormData, price: val });
                    }}
                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Expiration Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar 
                  size={16} 
                  onClick={() => dateInputRef.current?.showPicker()}
                  style={{ 
                    position: 'absolute', 
                    left: '0.75rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                    zIndex: 10
                  }} 
                />
                <input
                  ref={dateInputRef}
                  type="date"
                  className="hide-datepicker-icon"
                  value={itemFormData.expirationDate || ''}
                  onChange={(e) => setItemFormData({ ...itemFormData, expirationDate: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description</label>
              <textarea
                rows={2}
                value={itemFormData.description || ''}
                onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button type="button" variant="ghost" onClick={() => setIsItemModalOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handleSaveItem}>Confirm Item</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcquisitionFormPage;
