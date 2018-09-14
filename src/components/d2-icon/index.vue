<template>
  <i class="`fa fa-${name} fa-${size}`" aria-hidden="true"></i>
</template>

<script>
import './font-awesome-4.7.0/css/font-awesome.min.css'
export default {
  name: 'd2-icon',
  props: {
    name: {
      type: String,
      required: false,
      default: 'font-awesome'
    },
    size: {
      type: String,
      required: false,
      default: 'lg'
    }
  }
}
</script>
