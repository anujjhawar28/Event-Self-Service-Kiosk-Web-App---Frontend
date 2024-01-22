<template>
  <div class="px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center sm:pt-40">
      <h2 class="text-xl font-bold tracking-tight text-white sm:text-3xl">Pre Registered</h2>
      <div class="w-full h-96">
        <div class="flex flex-row mt-8 space-x-2">
          <div class="w-full">
            <input
              v-bind="uniqueIdAttr"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset pl-5 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter UniqueId"
              v-model="uniqueId"
            />
            <span class="text-red-500">{{ errors['uniqueId'] }}</span>
          </div>
        </div>

        <div class="flex flex-row mt-8 justify-center">
          <button
            @click="onSubmit"
            type="button"
            class="rounded-md cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { verifyUser } from '../utils/service'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue3-toastify'
import { useUserStore } from '../stores/currentUser'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const { updateUser, currentUser } = useUserStore()
    const router = useRouter()
    const { errors, handleSubmit, defineField, resetForm } = useForm({
      validationSchema: yup.object({
        uniqueId: yup.string().required(),
      })
    })

    onMounted(() => {
      currentUser.value = {}
    })

    const [uniqueId, uniqueIdAttrs] = defineField('uniqueId')

    const submit = async () => {
      verifyUser({ uniqueId: uniqueId.value })
        .then(({ data }) => {
          resetForm()
          if (data.status === 200) {
            updateUser(data.data)
            router.push({
              name: 'user-details',
              params: {
                userId: data.data.uniqueId
              }
            })
            setTimeout(() => {
              toast.success('Verified Successfully !', {
                autoClose: 2000
              })
            }, 1000)
          }
        })
        .catch(() => {
          toast.error('User is not registered. please register from walk in section.', {
            autoClose: 3000
          });
        })
    }
    const onSubmit = handleSubmit(submit)

    return {
      uniqueId,
      uniqueIdAttrs,
      onSubmit,
      errors
    }
  }
})
</script>
