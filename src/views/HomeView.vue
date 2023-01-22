<template>
    <v-container class="w-75 pt-8">
        <h1 class="text-h3 font-weight-bold">Hallo Sebastian!</h1>

        <div style="width: 300px">
            <lara-button class="mt-8 mb-8" type="primary">Neue Recherche starten</lara-button>
        </div>

        <h1 class="text-h4">Meine Recherchen</h1>

        <div class="mt-4 d-flex flex-wrap flex-row gap-8">
            <research-card v-for="research in researches"
                           :title="research.title"
                           :description="research.description"
                           :added="research.added"
                           :enqueued="research.enqueued"
                           :started-at="research.startedAt"
                           @edit=""
            />
        </div>
    </v-container>
</template>

<script setup lang="ts">
import ResearchCard from "@/components/cards/ResearchCard.vue";
import LaraButton from "@/components/basic/LaraButton.vue";

const researches = [
  {
    title: "Masterarbeit",
    description: "Recherche für meine Masterarbeit über die Weiterentwicklung bekannter Sortieralgorithmen",
    added: 13,
    enqueued: 8,
    startedAt: "12.11.2022"
  },
  {
    title: "Seminararbeit Sicherheit",
    description: "Seminarmodul Informationssicherheit, Bachelor Informatik",
    added: 8,
    enqueued: 12,
    startedAt: "01.06.2019"
  },
  {
    title: "Datenschutzrecht konkret",
    description: "Persönliche Recherche, in welchen Bereichen des Alltags das Datenschutzrecht Anwendung findet",
    added: 19,
    enqueued: 22,
    startedAt: "22.03.2020"
  },
  {
    title: "Recherche",
    description: "Diese Recherche hat wenig Text",
    added: 69,
    enqueued: 420,
    startedAt: "01.01.2023"
  }
]
</script>

<style>

</style>