<template>
  <div class="px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center sm:pt-40">
      <h2 class="text-xl font-bold tracking-tight text-white sm:text-3xl">Walk In Customer</h2>
      <div class="w-full h-96">
        <div class="flex flex-row mt-8 space-x-2">
          <div class="w-6/12">
            <input
              v-bind="firstnameAttrs"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset pl-5 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter Firstname"
              v-model="firstname"
            />
            <span class="text-red-500">{{ errors['firstname'] }}</span>
          </div>
          <div class="w-6/12">
            <input
              v-bind="lastnameAttrs"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset pl-5 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter Lastname"
              v-model="lastname"
            />
            <span class="text-red-500">{{ errors['lastname'] }}</span>
          </div>
        </div>
        <div class="flex flex-row mt-8 space-x-2">
          <div class="w-full">
            <input
              v-bind="emailAttrs"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset pl-5 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter Email"
              v-model="email"
            />
            <span class="text-red-500">{{ errors['email'] }}</span>
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
import { createUser } from '../utils/service'
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
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        email: yup.string().email().required()
      })
    })

    onMounted(() => {
      currentUser.value = {}
    })

    const [firstname, firstnameAttrs] = defineField('firstname')
    const [lastname, lastnameAttrs] = defineField('lastname')
    const [email, emailAttrs] = defineField('email')

    const submit = async () => {
      createUser({ firstname: firstname.value, lastname: lastname.value, email: email.value })
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
              toast.success('Saved Successfully !', {
                autoClose: 2000
              })
            }, 1000)
          }
        })
        .catch(() => {
          toast.error('Registration Failed !', {
            autoClose: 3000
          })
        })
    }
    const onSubmit = handleSubmit(submit)

    return {
      firstname,
      firstnameAttrs,
      lastname,
      lastnameAttrs,
      email,
      emailAttrs,
      onSubmit,
      errors
    }
  }
})
</script>
