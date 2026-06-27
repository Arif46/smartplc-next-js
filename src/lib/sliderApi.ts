import api from "@/lib/api";

export interface Slider {
  id: number;
  title: string | null;
  subtitle: string | null;
  desktop_image: string;
  mobile_image: string | null;
  desktop_image_url: string | null;
  mobile_image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  display_order: number;
  is_active: boolean;
}

export const fetchSliders = async (): Promise<Slider[]> => {
  const res = await api.get("/api/admin/sliders");
  return res.data.data;
};

export const createSlider = async (formData: FormData): Promise<Slider> => {
  const res = await api.post("/api/admin/sliders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateSlider = async (id: number, formData: FormData): Promise<Slider> => {
  formData.append("_method", "PUT");
  const res = await api.post(`/api/admin/sliders/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deleteSlider = async (id: number) => {
  const res = await api.delete(`/api/admin/sliders/${id}`);
  return res.data;
};

export const toggleSlider = async (id: number): Promise<Slider> => {
  const res = await api.patch(`/api/admin/sliders/${id}/toggle`);
  return res.data.data;
};
