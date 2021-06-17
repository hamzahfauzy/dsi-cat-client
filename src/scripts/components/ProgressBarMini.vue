<template>
    <div>
        <h2 style="font-size:22px;margin:0;" v-html="title"></h2>
        <div class="progress-section" :class="{'flex':flex==true}">
            <template v-if="level==false||level==''">
            <b>Progres</b>
            <md-badge class="md-primary md-square" :class="{'md-badge-complete':progress_percent == 100}" :md-content="progress_percent+'%'"/>
            </template>
            <template v-else>
                &nbsp;
            </template>
        </div>
        <md-progress-bar :style="{opacity:level==false||level==''?'1':'0'}" class="md-primary" style="margin-bottom:10px;" md-mode="determinate" :md-value="progress_percent" :class="{'md-complete':progress_percent == 100}"></md-progress-bar>
    </div>
</template>
<script>
export default {
    props:{
        progress_percent:0,
        flex:true,
        title:'',
        level:'',
    }
}
</script>