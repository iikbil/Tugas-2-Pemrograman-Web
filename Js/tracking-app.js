const app = Vue.createApp({
  data() {
    return {
      query: "",
      result: null,
      error: "",
      trackingData: window.dataBahanAjar?.tracking || {},
      paketList: window.dataBahanAjar?.paket || [],
      ekspedisiList: window.dataBahanAjar?.pengirimanList || [],
      newDOEntry: {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: "",
      },
      successMessage: "",
      showFormTracking: false,
    };
  },
  created() {
    this.newDOEntry.tanggalKirim = this.getTodayDate();
  },
  computed: {
    newDoNumber() {
      const year = new Date().getFullYear();
      const currentKeys = Object.keys(this.trackingData).filter((key) =>
        key.startsWith(`DO${year}`),
      );
      if (!currentKeys.length) {
        return `DO${year}-001`;
      }
      const highestSequence = currentKeys
        .map((key) => Number(key.split("-")[1] || 0))
        .filter((num) => !Number.isNaN(num)) //ambil yang bukan NaN
        .reduce((max, num) => (num > max ? num : max), 0); //mencari angka terbesar
      const nextSequence = String(highestSequence + 1).padStart(3, "0"); //mengubahnya ke string dengan 3 digit
      return `DO${year}-${nextSequence}`;
    },

    selectedPackage() {
      return (
        this.paketList.find(
          (paket) => paket.kode === this.newDOEntry.paketKode,
        ) || null
      );
    },
    formattedTotalHarga() {
      if (!this.selectedPackage) {
        return "Rp0";
      }
      return `Rp${this.selectedPackage.harga.toLocaleString()}`;
    },
  },
  methods: {
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    openFormTracking() {
      this.showFormTracking = true;
    },
    closeModal() {
      this.showFormTracking = false;
    },
    searchTracking() {
      const key = this.query.trim().toUpperCase();
      if (!key) {
        this.result = null;
        this.error = "Masukkan nomor DO terlebih dahulu.";
        return;
      }

      const trackingInfo = this.trackingData[key];
      if (!trackingInfo) {
        this.result = null;
        this.error = `Data tracking untuk DO ${key} tidak ditemukan.`;
        return;
      }

      this.result = {
        kode: key,
        ...trackingInfo,
      };
      this.error = "";
    },
    addNewDeliveryOrder() {
      if (
        !this.newDOEntry.nim ||
        !this.newDOEntry.nama ||
        !this.newDOEntry.ekspedisi ||
        !this.newDOEntry.paketKode ||
        !this.newDOEntry.tanggalKirim
      ) {
        this.error = "Lengkapi semua field form DO baru terlebih dahulu.";
        this.result = null;
        this.successMessage = "";
        return;
      }

      const doNumber = this.newDoNumber;
      const paket = this.selectedPackage;

      if (!paket) {
        this.error = "Pilih paket bahan ajar yang valid.";
        this.result = null;
        this.successMessage = "";
        return;
      }

      this.trackingData[doNumber] = {
        nim: this.newDOEntry.nim,
        nama: this.newDOEntry.nama,
        status: "Menunggu Pengiriman",
        ekspedisi: this.newDOEntry.ekspedisi,
        tanggalKirim: this.newDOEntry.tanggalKirim,
        paket: `${paket.kode} - ${paket.nama}`,
        total: paket.harga,
        perjalanan: [],
      };

      this.successMessage = `DO baru berhasil ditambahkan: ${doNumber}`;
      this.error = "";
      this.query = doNumber;
      this.result = {
        kode: doNumber,
        ...this.trackingData[doNumber],
      };
      this.resetNewDOForm();
    },
    resetNewDOForm() {
      this.newDOEntry = {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: this.getTodayDate(),
      };
    },
  },
}).mount("#app");
