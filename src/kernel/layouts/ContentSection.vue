<template>
  <div class="p-1">
    <div class="rounded-lg shadow-lg p-2">
      <div class="grid grid-cols-12 mb-1 content-start">
        <div class="col-span-12 lg:col-span-6">
          <div class="col-span-12">
            <h1
              class="text-xl sm:text-2xl lg:text-4xl text-gray-900 dark:text-white mb-2 font-semibold"
            >
              <slot name="title"></slot>
            </h1>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-6">
          <div class="flex flex-row justify-end">
            <slot name="contentOptions"></slot>
          </div>
        </div>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>