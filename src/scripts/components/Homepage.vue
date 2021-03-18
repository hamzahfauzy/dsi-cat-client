<template>
    <div id="homepage">
        <section class="top" style="background-image:url(dist/images/banner.jpeg);">
            <md-toolbar class="md-transparent" style="box-shadow:none;">
                <router-link to="/login">
                    <md-button class="md-icon-button">
                        <md-icon>login</md-icon>
                    </md-button>
                </router-link>
            </md-toolbar>

            <div class="logo" style="background-image:url(dist/images/logo_app_small.png)"></div>
            
            <div class="title-section">
                <h2>FPKAD</h2>
                <span>KEMENTRIAN DALAM NEGERI</span>
            </div>
        </section>

        <div class="homepage-content">
            <div class="service-item">
                <md-avatar class="md-large">
                    <img src="dist/images/public.png" alt="" width="150px">
                </md-avatar>
                <h4>LAYANAN PUBLIK</h4>
            </div>
            <div class="service-item">
                <router-link to="/login">
                    <md-avatar class="md-large">
                        <img src="dist/images/government.png" width="150px">
                    </md-avatar>
                    <h4>LAYANAN PEMERINTAHAN</h4>
                </router-link>
            </div>
        </div>

        <div class="footer">
            <center>
                2021 &copy; ONLINE SERVICE<br>DISKOMINFO KABUPATEN LABUHANBATU UTARA
            </center>
        </div>
    </div>
</template>