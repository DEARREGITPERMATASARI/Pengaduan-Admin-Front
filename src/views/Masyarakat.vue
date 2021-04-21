<template>
  <div>
    <br />
    <br />
    <br />
    <div class="container mt-3">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title float-left">Data Masyarakat</h2>
              <p class="card-description float-right">
                <b-button variant="success" v-b-modal.modalPengaduan v-on:click="Add"><i class="mdi mdi-plus btn-icon-prepend"></i> Tambah</b-button>
              </p>
              <div class="table-responsive">
                <b-table striped hover :items="user" :fields="fields">
                  <template v-slot:cell(level)="data">
                    <b-badge variant="warning">{{ data.item.level }}</b-badge>
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button variant="info" v-on:click="Edit(data.item)" v-b-modal.modalPengaduan><i class="mdi mdi-pencil btn-icon-prepend"></i> Ubah</b-button>&nbsp;
                    <b-button variant="danger" v-on:click="Drop(data.item.id)"><i class="mdi mdi-delete btn-icon-prepend"></i> Hapus</b-button>
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
        Form Masyarakt
      </template>
        <form ref="form">
          <div class="form-group">
            <label for="nik" class="col-form-label">NIK</label>
            <input type="text" name="nik" class="form-control" id="nik" placeholder="NIK" v-model="nik">
          </div>
          <div class="form-group">
            <label for="nama" class="col-form-label">Nama</label>
            <input type="text" name="nama" class="form-control" id="nama" placeholder="Nama Lengkap" v-model="nama">
          </div>
          <div class="form-group">
              <label for="telp" class="col-form-label">Telepon</label>
              <input type="text" name="telp" class="form-control" id="telp" placeholder="Telepon" v-model="telp">
          </div>
          <div class="form-group">
              <label for="username" class="col-form-label">Username</label>
              <input type="text" name="username" class="form-control" id="username" placeholder="Username" v-model="username">
          </div>
          <div class="form-group">
              <label for="password" class="col-form-label">Password</label>
              <input type="password" name="password" class="form-control" id="password" placeholder="Password" v-model="password">
          </div>
          <div class="form-group">
            <label for="level" class="col-form-label">Level</label>
            <select class="form-control" name="level" id="level" v-model="level">
              <option value="admin" checked>Admin</option>
              <option value="petugas">Petugas</option>
              <option value="masyarakat">Masyarakat</option>
            </select>
          </div> 
          <div class="form-group">
            <label for="gender" class="col-form-label">Jenis Kelamin</label>
            <select class="form-control"  name="gender" id="gender" v-model="gender">
              <option value="L" checked>Laki-Laki</option>
              <option value="P">Perempuan</option>
            </select>
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
      id: "",
      nik: "",
      nama: "",
      username: "",
      telp: "",
      password: "",
      level: "",
      gender: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      key: "",
      user: [],
      fields: ["id", "nik", "nama", "username", "telp", "level","gender","Aksi"],
    }
  },

 methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/masyarakat/" + this.perPage + "/" + offset, conf)
      .then(response => {
        if(response.data.success == true){
          this.$bvToast.hide("loadingToast");
          this.user = response.data.data.user;
          this.rows = response.data.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data pengguna."
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
      this.nik = "";
      this.nama = "";
      this.username = "";
      this.telp = "";
      this.password = ""; 
      this.level = "";
      this.gender = "";
},

    Edit : function(item){
      this.action = "update";
      this.id= item.id;
      this.nik = item.nik;
      this.nama = item.nama;
      this.username = item.username;
      this.telp = item.telp;
      this.password = item.password;
      this.level = item.level;
      this.gender = item.gender;
    },

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.key } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        form.append("id", this.id);
        form.append("nik", this.nik);
        form.append("nama", this.nama);
        form.append("username", this.username);
        form.append("telp", this.telp);
        form.append("password", this.password);
        form.append("level", this.level);
        form.append("gender", this.gender);

        this.axios.post("/masyarakat", form, conf)
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
          nik: this.nik,
          nama: this.nama,
          username: this.username,
          telp: this.telp,
          password: this.password,
          level: this.level,
          gender: this.gender
        }
        this.axios.put("/masyarakat/" + this.id, form, conf)
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

    Drop : function(id){
      let conf = { headers: { "Authorization" : "Bearer " + this.key} };
      if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        this.$bvToast.show("loadingToast");
        this.axios.delete("/masyarakat/" + id, conf)
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