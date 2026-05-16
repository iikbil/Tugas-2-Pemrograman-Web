const app = Vue.createApp({
  data() {
    return {
      // DATA DARI dataBahanAjar.js
      stokData: window.dataBahanAjar?.stok || [],
      upbjjList: window.dataBahanAjar?.upbjjList || [],
      kategoriList: window.dataBahanAjar?.kategoriList || [],

      // FILTER
      filterUpbjj: "",
      filterKategori: "",
      filterStatus: "",
      sortBy: "",

      // MODAL
      showAddStockModal: false,
      // EDIT STOK
      showEditStockModal: false,
      editIndex: null,
      editStockQty: null,

      // FORM DATA BARU
      newStock: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: null,
        qty: null,
        safety: null,
        catatan: "",
      },
    };
  },

  computed: {
    // DEPENDENT OPTION
    kategoriFiltered() {
      // jika belum pilih UT
      if (this.filterUpbjj == "") {
        return [];
      }

      // ambil kategori sesuai UT
      return this.kategoriList;
    },

    // FILTER DATA
    filteredStok() {
      let data = [...this.stokData];

      // FILTER UT
      if (this.filterUpbjj != "") {
        data = data.filter((item) => item.upbjj == this.filterUpbjj);
      }

      // FILTER KATEGORI
      if (this.filterKategori != "") {
        data = data.filter((item) => item.kategori == this.filterKategori);
      }
      // FILTER STATUS
      if (this.filterStatus == "menipis") {
        data = data.filter((item) => item.qty < item.safety && item.qty > 0);
      }

      // FILTER KOSONG
      if (this.filterStatus == "kosong") {
        data = data.filter((item) => item.qty == 0);
      }

      // SORT JUDUL
      if (this.sortBy == "judul") {
        data.sort((a, b) => a.judul.localeCompare(b.judul));
      }

      // SORT STOK
      if (this.sortBy == "qty") {
        data.sort((a, b) => a.qty - b.qty);
      }
      // SORT HARGA
      if (this.sortBy == "harga") {
        data.sort((a, b) => a.harga - b.harga);
      }
      return data;
    },
  },

  methods: {
    // RESET FILTER
    resetFilter() {
      this.filterUpbjj = "";
      this.filterKategori = "";
      this.filterStatus = "";
      this.sortBy = "";
    },
    openModal() {
      this.showAddStockModal = true;
    },
    closeModal() {
      this.showAddStockModal = false;
    },
    resetNewStockForm() {
      this.newStock = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: null,
        qty: null,
        safety: null,
        catatan: "",
      };
    },
    submitNewStock() {
      const newItem = {
        kode: this.newStock.kode,
        judul: this.newStock.judul,
        kategori: this.newStock.kategori,
        upbjj: this.newStock.upbjj,
        lokasiRak: this.newStock.lokasiRak,
        harga: Number(this.newStock.harga) || 0,
        qty: Number(this.newStock.qty) || 0,
        safety: Number(this.newStock.safety) || 0,
        catatanHTML: this.newStock.catatan || "",
      };

      this.stokData.push(newItem);
      this.resetNewStockForm();
      this.closeModal();
    },
    // EDIT STOK: hanya mengubah `qty`
    openEditModal(kode) {
      const idx = this.stokData.findIndex((i) => i.kode === kode);
      if (idx === -1) return;
      this.editIndex = idx;
      this.editStockQty = this.stokData[idx].qty;
      this.showEditStockModal = true;
    },
    closeEditModal() {
      this.showEditStockModal = false;
      this.editIndex = null;
      this.editStockQty = null;
    },
    submitEditStock() {
      if (this.editIndex === null) return;
      // hanya update qty, tidak menyentuh properti lain
      this.stokData[this.editIndex].qty = Number(this.editStockQty) || 0;
      this.closeEditModal();
    },
  },

  watch: {
    // WATCH FILTER UT
    filterUpbjj(newValue) {
      console.log("UT berubah:", newValue);

      // reset kategori
      this.filterKategori = "";
    },

    // WATCH FILTER STATUS
    filterStatus(newValue) {
      console.log("Status berubah:", newValue);
    },
  },
});
app.mount("#app");

//let data = window.dataBahanAjar?.stok || [];
