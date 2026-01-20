import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  XCircle,
  Power,
  PowerOff,
  FolderOpen,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { useToast } from '@/hooks/use-toast';

/**
 * Type definitions
 */
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'disabled';
  sections_count: number;
  created_at: string;
  updated_at: string;
}

interface Section {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'disabled';
  worker_services_count: number;
  created_at: string;
  updated_at: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'disabled';
}

interface SectionFormData {
  category_id: string;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'disabled';
}

/**
 * AdminServices Component
 * 
 * Full-featured services management page with:
 * - Category management (CRUD operations)
 * - Section management (CRUD operations)
 * - Search and filtering
 * - Status toggle (active/disabled)
 * - Worker service impact tracking
 * - Confirmation dialogs for destructive actions
 */
const AdminServices = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State management
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: 'category' | 'section'; id: string; name: string } | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    status: 'active',
  });
  const [sectionForm, setSectionForm] = useState<SectionFormData>({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    status: 'active',
  });

  /**
   * Fetch categories from API
   */
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await axiosPublic.get('/categoryRoutes/categories');
      return response.data;
    },
    select: (data) => data || [],
  });

  /**
   * Fetch sections for selected category
   */
  const { data: sections, isLoading: sectionsLoading } = useQuery<Section[]>({
    queryKey: ['admin-sections', selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) {
        const response = await axiosPublic.get('/categoryRoutes/sections');
        return response.data;
      }
      const response = await axiosPublic.get(`/categoryRoutes/categories/${selectedCategoryId}/sections`);
      return response.data;
    },
    enabled: true,
    select: (data) => {
      // Ensure data is always an array
      if (!data) return [];
      if (Array.isArray(data)) return data;
      // If data is wrapped in a property, extract it
      if (typeof data === 'object' && Array.isArray((data as any).sections)) {
        return (data as any).sections;
      }
      if (typeof data === 'object' && Array.isArray((data as any).data)) {
        return (data as any).data;
      }
      return [];
    },
  });

  /**
   * Auto-select first category on load
   */
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  /**
   * Filter sections based on search and filters
   */
  const filteredSections = (sections || []).filter((section) => {
    const matchesSearch =
      section.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || section.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || section.category_id === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  /**
   * Create category mutation
   */
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await axiosPublic.post('/categoryRoutes/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Success', description: 'Category created successfully' });
      setCategoryDialogOpen(false);
      resetCategoryForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  /**
   * Update category mutation
   */
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      const response = await axiosPublic.put(`/categoryRoutes/categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Success', description: 'Category updated successfully' });
      setCategoryDialogOpen(false);
      resetCategoryForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update category',
        variant: 'destructive',
      });
    },
  });

  /**
   * Delete category mutation
   */
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosPublic.delete(`/categoryRoutes/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Success', description: 'Category deleted successfully' });
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete category',
        variant: 'destructive',
      });
    },
  });

  /**
   * Create section mutation
   */
  const createSectionMutation = useMutation({
    mutationFn: async (data: SectionFormData) => {
      const response = await axiosPublic.post('/categoryRoutes/sections', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Success', description: 'Section created successfully' });
      setSectionDialogOpen(false);
      resetSectionForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create section',
        variant: 'destructive',
      });
    },
  });

  /**
   * Update section mutation
   */
  const updateSectionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SectionFormData }) => {
      const response = await axiosPublic.put(`/categoryRoutes/sections/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Success', description: 'Section updated successfully' });
      setSectionDialogOpen(false);
      resetSectionForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update section',
        variant: 'destructive',
      });
    },
  });

  /**
   * Delete section mutation
   */
  const deleteSectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosPublic.delete(`/categoryRoutes/sections/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Success', description: 'Section deleted successfully' });
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete section',
        variant: 'destructive',
      });
    },
  });

  /**
   * Form reset functions
   */
  const resetCategoryForm = () => {
    setCategoryForm({ name: '', slug: '', description: '', status: 'active' });
    setEditingCategory(null);
  };

  const resetSectionForm = () => {
    setSectionForm({ category_id: selectedCategoryId || '', name: '', slug: '', description: '', status: 'active' });
    setEditingSection(null);
  };

  /**
   * Handle category form submission
   */
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryForm });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  /**
   * Handle section form submission
   */
  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      updateSectionMutation.mutate({ id: editingSection.id, data: sectionForm });
    } else {
      createSectionMutation.mutate(sectionForm);
    }
  };

  /**
   * Open edit category dialog
   */
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      status: category.status,
    });
    setCategoryDialogOpen(true);
  };

  /**
   * Open edit section dialog
   */
  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setSectionForm({
      category_id: section.category_id,
      name: section.name,
      slug: section.slug,
      description: section.description,
      status: section.status,
    });
    setSectionDialogOpen(true);
  };

  /**
   * Toggle category status
   */
  const handleToggleCategoryStatus = (category: Category) => {
    const newStatus = category.status === 'active' ? 'disabled' : 'active';
    updateCategoryMutation.mutate({
      id: category.id,
      data: { ...category, status: newStatus },
    });
  };

  /**
   * Toggle section status
   */
  const handleToggleSectionStatus = (section: Section) => {
    const newStatus = section.status === 'active' ? 'disabled' : 'active';
    updateSectionMutation.mutate({
      id: section.id,
      data: { ...section, status: newStatus },
    });
  };

  /**
   * Get status badge
   */
  const getStatusBadge = (status: 'active' | 'disabled') => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        <XCircle className="w-3 h-3 mr-1" />
        Disabled
      </Badge>
    );
  };

  /**
   * Auto-generate slug from name
   */
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <p className="text-gray-500 mt-2">Manage service categories, sections, and availability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Categories</span>
              <Button
                size="sm"
                onClick={() => {
                  resetCategoryForm();
                  setCategoryDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedCategoryId === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditCategory(category); }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCategoryStatus(category);
                            }}
                          >
                            {category.status === 'active' ? (
                              <>
                                <PowerOff className="w-4 h-4 mr-2" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Power className="w-4 h-4 mr-2" />
                                Enable
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingItem({ type: 'category', id: category.id, name: category.name });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FolderOpen className="w-4 h-4" />
                        <span>{category.sections_count} sections</span>
                      </div>
                      {getStatusBadge(category.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No categories found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sections Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sections {selectedCategoryId && `(${filteredSections.length})`}</span>
              <Button
                size="sm"
                onClick={() => {
                  resetSectionForm();
                  setSectionForm((prev) => ({ ...prev, category_id: selectedCategoryId || '' }));
                  setSectionDialogOpen(true);
                }}
                disabled={!selectedCategoryId}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search sections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sections Table */}
            {sectionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredSections.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Worker Services</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSections.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">{section.name}</TableCell>
                        <TableCell>
                          <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {section.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {section.description || 'No description'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{section.worker_services_count}</span>
                            {section.worker_services_count > 0 && section.status === 'disabled' && (
                              <div className="relative group">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
                                  Affects active services
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(section.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditSection(section)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleSectionStatus(section)}>
                                {section.status === 'active' ? (
                                  <>
                                    <PowerOff className="w-4 h-4 mr-2" />
                                    Disable
                                  </>
                                ) : (
                                  <>
                                    <Power className="w-4 h-4 mr-2" />
                                    Enable
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setDeletingItem({ type: 'section', id: section.id, name: section.name });
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {selectedCategoryId ? 'No sections found' : 'Select a category to view sections'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category information' : 'Create a new service category'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Name</Label>
                <Input
                  id="category-name"
                  value={categoryForm.name}
                  onChange={(e) => {
                    setCategoryForm({ ...categoryForm, name: e.target.value });
                    if (!editingCategory) {
                      setCategoryForm((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-slug">Slug</Label>
                <Input
                  id="category-slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-status">Status</Label>
                <Select
                  value={categoryForm.status}
                  onValueChange={(value: 'active' | 'disabled') =>
                    setCategoryForm({ ...categoryForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Section Dialog */}
      <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
            <DialogDescription>
              {editingSection ? 'Update section information' : 'Create a new service section'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSectionSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="section-category">Category</Label>
                <Select
                  value={sectionForm.category_id}
                  onValueChange={(value) => setSectionForm({ ...sectionForm, category_id: value })}
                  disabled={!!editingSection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-name">Name</Label>
                <Input
                  id="section-name"
                  value={sectionForm.name}
                  onChange={(e) => {
                    setSectionForm({ ...sectionForm, name: e.target.value });
                    if (!editingSection) {
                      setSectionForm((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-slug">Slug</Label>
                <Input
                  id="section-slug"
                  value={sectionForm.slug}
                  onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-description">Description</Label>
                <Textarea
                  id="section-description"
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-status">Status</Label>
                <Select
                  value={sectionForm.status}
                  onValueChange={(value: 'active' | 'disabled') =>
                    setSectionForm({ ...sectionForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createSectionMutation.isPending || updateSectionMutation.isPending}>
                {editingSection ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingItem?.type === 'category' ? (
                <>
                  This will delete the category "<strong>{deletingItem.name}</strong>" and all its sections.
                  This action cannot be undone.
                </>
              ) : (
                <>
                  This will delete the section "<strong>{deletingItem?.name}</strong>".
                  {sections?.find((s) => s.id === deletingItem?.id)?.worker_services_count! > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <AlertCircle className="w-4 h-4 text-yellow-600 inline mr-2" />
                      <span className="text-sm text-yellow-800">
                        This section is used by{' '}
                        {sections?.find((s) => s.id === deletingItem?.id)?.worker_services_count} worker service(s).
                      </span>
                    </div>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingItem?.type === 'category') {
                  deleteCategoryMutation.mutate(deletingItem.id);
                } else if (deletingItem?.type === 'section') {
                  deleteSectionMutation.mutate(deletingItem.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminServices;
