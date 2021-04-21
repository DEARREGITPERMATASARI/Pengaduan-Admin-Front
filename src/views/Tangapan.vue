<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title float-left">Tanggapan</h2>
              <p class="card-description float-right">
                <b-button variant="success" v-b-modal.modalPengaduan v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i> Tambah</b-button>
              </p>
              <div class="table-responsive">
                <b-table striped hover :items="tanggapan" :fields="fields">
                  <template v-slot:cell(role)="data">
                    <b-badge variant="warning">{{ data.item.role }}</b-badge>
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination">
                </b-pagination>

                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>

                <!-- toast untuk tampilan message box -->
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal 
      id="modalPengaduan"
      @ok="Save"
    >
      <template v-slot:modal-title>
        Form Taggapan
      </template>
        <form ref="form">
          <div class="form-group">
            <label for="tgl_tanggapan" class="col-form-label">Tanggal Tanggapan</label>
            <input type="text" name="tgl_tanggapan" class="form-control" id="tgl_tanggapan" placeholder="Y-m-d">
          </div>
          <div class="form-group">
            <label for="tanggapan" class="col-form-label">Tanggapan</label>
            <input type="text" name="tanggapan" class="form-control" id="tanggapan" placeholder="Beri Tanggapan">
          </div>
        </form>
    </b-modal>

  </div>
</template>

<script>
module.exports = {
  data : function(){
    return {
      search: "",
      id_tanggapan: "",
      id_pengaduan: "",
      id_petugas: "",
      tgl_tanggapan: "",
      tangapan: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      tanggapan: [],
      fields: ["id_tanggapan", "id_pengaduan", "id_petugas", "tgl_tanggapan", "tanggapan", "Aksi"],
    }
  },

  methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/tangapan/" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.status == 1){
          this.$bvToast.hide("loadingToast");
          this.nama_kategori = response.nama_kategori;
          this.rows = response.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data kategori."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    },

    pagination : function(){
      if(this.search == ""){
        this.getData();
      } else {
        this.searching();
      }
    },

    Add : function(){
      this.action = "insert";
      this.tgl_tanggapan = "";
      this.tanggapan = "";
    },

    Edit : function(item){
      this.action = "update";
      this.id_tanggapan = item.id_tanggapan;
      this.tgl_tanggapan = item.tgl_tanggapan;
      this.tangapan = item.tangapan;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id_kategori", this.id_kategori);
        form.append("nama_kategori", this.nama_kategori);

        this.axios.post("/kategori", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        let form = {
          nama_kategori: this.nama_kategori,
        }
        this.axios.put("/kategori/" + this.id_kategori, form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },

    Drop : function(id_kategori){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/kategori/" + id_kategori, conf)
        .then(response => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  },
  mounted(){
    this.key = localStorage.getItem("Authorization");
    this.getData();
  }
}
</script>