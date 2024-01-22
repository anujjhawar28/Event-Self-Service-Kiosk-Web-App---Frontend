<template>
  <div class="px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center sm:pt-40">
      <div ref="htmlContent">
        <div class="flex flex-column justify-center" v-if="currentUser.value">
          <qrcode-vue :value="currentUser.value.uniqueId" size="200" level="H" />
        </div>
        <div v-if="currentUser.value" class="text-lg text-white">
          {{ currentUser.value.uniqueId }}
        </div>
        <div class="w-full h-full">
          <div class="flex flex-row mt-8 space-x-2">
            <dl
              v-if="currentUser.value"
              class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6 w-full"
            >
              <div class="pt-6 sm:flex">
                <dt class="font-medium text-white sm:w-5/12 sm:flex-none sm:pr-6 text-left">
                  Profile Image
                </dt>
                <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <img
                    :src="currentUser.value.image"
                    :alt="currentUser.value.firstname"
                    class="w-40 h-40 rounded-xl"
                    v-if="currentUser.value.email"
                  />
                  <span v-else>&mdash;</span>
                </dd>
              </div>
              <div class="pt-6 sm:flex">
                <dt class="font-medium text-white sm:w-5/12 sm:flex-none sm:pr-6 text-left">
                  First Name
                </dt>
                <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div class="text-white" v-if="currentUser.value.firstname">
                    {{ currentUser.value.firstname }}
                  </div>
                  <span v-else>&mdash;</span>
                </dd>
              </div>
              <div class="pt-6 sm:flex">
                <dt class="font-medium text-white sm:w-5/12 sm:flex-none sm:pr-6 text-left">
                  Last Name
                </dt>
                <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div class="text-white" v-if="currentUser.value.lastname">
                    {{ currentUser.value.lastname }}
                  </div>
                  <span v-else>&mdash;</span>
                </dd>
              </div>
              <div class="pt-6 sm:flex">
                <dt class="font-medium text-white sm:w-5/12 sm:flex-none sm:pr-6 text-left">
                  Email address
                </dt>
                <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div class="text-white" v-if="currentUser.value.email">
                    {{ currentUser.value.email }}
                  </div>
                  <span v-else>&mdash;</span>
                </dd>
              </div>
            </dl>
          </div>
          <div class="my-10 flex justify-center">
            <button
              @click="generatePdf"
              type="button"
              class="rounded-md mt-4 cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Generate Badge
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { getUserById } from '../utils/service'
import { useUserStore } from '../stores/currentUser'
import { useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import jsPDF from 'jspdf'

export default defineComponent({
  components: {
    QrcodeVue
  },
  setup() {
    const { currentUser, getCurrentUser } = useUserStore()
    const { params } = useRoute()
    const htmlContent = ref()

    onMounted(async () => {
      if (!getCurrentUser.value) {
        const { data: user } = await getUserById(params.userId)
        if (user.status === 200) {
          currentUser.value = { ...user.data }
        }
      }
    })

    const generatePdf = () => {
      const content = htmlContent.value
      const pdf = new jsPDF('p', 'pt', 'a4')

      pdf.html(content, {
        callback: (pdf) => {
          pdf.save('generated-document.pdf');
          
        }
      })
    }

    return {
      htmlContent,
      currentUser,
      generatePdf
    }
  }
})
</script>
