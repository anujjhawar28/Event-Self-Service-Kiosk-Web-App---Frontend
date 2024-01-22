<template>
  <div class="px-6 lg:px-8">
    <div class="mx-auto max-w-3xl pt-24 text-center sm:pt-40">
      <h2 class="text-xl font-bold tracking-tight text-white sm:text-3xl" v-if="currentUser.value">
        Hello {{ currentUser.value.firstname }} !!
      </h2>
      <div class="w-full">
        <div class="flex flex-row mt-8 space-x-2">
          <dl
            v-if="currentUser.value"
            class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6 w-full"
          >
            <div class="pt-6 sm:flex">
              <dt class="font-medium text-white sm:w-5/12 sm:flex-none sm:pr-6 text-left">
                Unique Id
              </dt>
              <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div class="text-white text-3xl" v-if="currentUser.value.uniqueId">
                  {{ currentUser.value.uniqueId }}
                </div>
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
          <div v-show="!capturedImage">
            <div id="webcam-container" />
            <button
              @click="captureImage"
              type="button"
              class="rounded-md mt-4 cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Capture Image
            </button>
          </div>
          <div v-show="capturedImage">
            <div>
              <img :src="capturedImage" alt="Captured Image" />
            </div>
            <div class="flex justify-center mt-4 space-x-4">
              <button
                @click="capturedImage = null"
                type="button"
                class="rounded-md cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Capture Again
              </button>
              <button
                @click="save"
                type="button"
                class="rounded-md cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { getUserById, updateUser, uploadImage } from '../utils/service'
import { toast } from 'vue3-toastify'
import { useUserStore } from '../stores/currentUser'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const { currentUser, getCurrentUser } = useUserStore()
    const router = useRouter()
    const { params } = useRoute()
    const capturedImage = ref()
    const htmlContent = ref()

    const captureImage = () => {
      Webcam.snap((data_uri) => {
        capturedImage.value = data_uri
      })
    }

    onMounted(async () => {
      if (!getCurrentUser.value) {
        const { data: user } = await getUserById(params.userId)
        if (user.status === 200) {
          currentUser.value = { ...user.data }
        }
      }
      if (getCurrentUser.value && getCurrentUser.value.image) {
        router.push({ name: 'badge-generate', params })
        return
      }
      Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 90
      })
      Webcam.attach('#webcam-container')
    })

    const save = async () => {
      if (!capturedImage.value) {
        console.error('No captured image available.')
        return
      }

      const file = dataURItoBlob(capturedImage.value)
      const formData = new FormData()
      formData.append('image', file, 'captured_image.jpg')

      uploadImage(formData).then(({ data }) => {
        if (data.status === 200) {
          updateUser({ uniqueId: params.userId, image: data.data.url })
            .then(({ data: updateUser }) => {
              if (updateUser.status === 200) {
                currentUser.value = { ...updateUser.data };
                setTimeout(() => {
                  router.push({ name: 'badge-generate' })
                }, 1500)
                toast.success('Image Saved Successfully !', {
                  autoClose: 3000
                })
              }
            })
            .catch(() => {
              toast.error('Failed to Save !', {
                autoClose: 3000
              })
            })
        }
      })
    }

    const dataURItoBlob = (dataURI) => {
      const arr = dataURI.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    }
    const generatePdf = () => {
      const content = htmlContent.value
      const pdf = new jsPDF('p', 'pt', 'a4')

      pdf.html(content, {
        callback: (pdf) => {
          pdf.save('generated-document.pdf')
        }
      })
    }

    return {
      capturedImage,
      captureImage,
      save,
      htmlContent,
      generatePdf,
      currentUser
    }
  }
})
</script>
