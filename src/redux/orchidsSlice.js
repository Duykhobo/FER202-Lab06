import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOrchids,
  createOrchid,
  updateOrchid,
  deleteOrchid
} from "../services/orchidService";
import { validateAuthSession } from "./authSlice";

// Async thunks cho CRUD API với MockAPI & Local Fallback
export const fetchOrchids = createAsyncThunk(
  "orchids/fetchOrchids",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrchids();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Không thể tải danh sách hoa lan");
    }
  }
);

// Thao tác Thêm: Kiểm tra phiên làm việc trước khi thực hiện
export const addOrchid = createAsyncThunk(
  "orchids/addOrchid",
  async (orchidData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!validateAuthSession() || !auth.isAuthenticated || !auth.isAdmin) {
      return rejectWithValue("Phiên làm việc đã kết thúc hoặc bạn đã đăng xuất. Vui lòng đăng nhập lại!");
    }
    try {
      const created = await createOrchid(orchidData);
      return created;
    } catch (err) {
      return rejectWithValue(err.message || "Lỗi khi thêm hoa lan mới");
    }
  }
);

// Thao tác Sửa: Kiểm tra phiên làm việc trước khi thực hiện
export const editOrchid = createAsyncThunk(
  "orchids/editOrchid",
  async ({ id, orchidData }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!validateAuthSession() || !auth.isAuthenticated || !auth.isAdmin) {
      return rejectWithValue("Phiên làm việc đã kết thúc hoặc bạn đã đăng xuất. Vui lòng đăng nhập lại!");
    }
    try {
      const updated = await updateOrchid(id, orchidData);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || "Lỗi khi cập nhật hoa lan");
    }
  }
);

// Thao tác Xóa: Kiểm tra phiên làm việc trước khi thực hiện
export const removeOrchid = createAsyncThunk(
  "orchids/removeOrchid",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!validateAuthSession() || !auth.isAuthenticated || !auth.isAdmin) {
      return rejectWithValue("Phiên làm việc đã kết thúc hoặc bạn đã đăng xuất. Vui lòng đăng nhập lại!");
    }
    try {
      await deleteOrchid(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Lỗi khi xóa hoa lan");
    }
  }
);

const orchidsSlice = createSlice({
  name: "orchids",
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchTerm: "",
    filterCategory: "all",
    filterNatural: "all", // "all" | "natural" | "special"
    sortBy: "default",
    selectedOrchid: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    setFilterNatural: (state, action) => {
      state.filterNatural = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSelectedOrchid: (state, action) => {
      state.selectedOrchid = action.payload;
    },
    clearSelectedOrchid: (state) => {
      state.selectedOrchid = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orchids
      .addCase(fetchOrchids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrchids.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrchids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add orchid
      .addCase(addOrchid.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOrchid.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(addOrchid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit orchid
      .addCase(editOrchid.pending, (state) => {
        state.loading = true;
      })
      .addCase(editOrchid.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          String(item.id) === String(action.payload.id) ? { ...item, ...action.payload } : item
        );
      })
      .addCase(editOrchid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove orchid
      .addCase(removeOrchid.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeOrchid.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => String(item.id) !== String(action.payload));
      })
      .addCase(removeOrchid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setFilterCategory,
  setFilterNatural,
  setSortBy,
  setSelectedOrchid,
  clearSelectedOrchid,
} = orchidsSlice.actions;

export default orchidsSlice.reducer;
