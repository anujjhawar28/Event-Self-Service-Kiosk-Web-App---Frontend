<template>
<header class="absolute inset-x-0 top-0 z-50">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <RouterLink to="/" class="-m-1.5 p-1.5">
          <img
            class="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt=""
          />
        </RouterLink>
      </div> 
      <div class="lg:flex lg:gap-x-12">
        <RouterLink to="/walk-in" class="text-sm font-semibold leading-6 text-white">Walk In</RouterLink>
        <RouterLink to="/pre-registered" class="text-sm font-semibold leading-6 text-white">Pre Registered</RouterLink>
      </div> 
    </nav> 
  </header>
</template>