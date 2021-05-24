<template>
    <div
        v-if="error && !validator"
        class="text-red-500 text-sm mb-2"
    >
        {{ error }}
    </div>
</template>

<script>
export default {
    name: 'Error',
    props: {
        error: String,
        validator: Boolean,
    }
}
</script>