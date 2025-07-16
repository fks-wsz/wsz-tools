<script>
export default {
  functional: true,
  name: 'AppendToBody',
  mounted() {
    document.body.appendChild(this.$el);
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  render(h) {
    return <view>{this.$slots.default || []}</view>;
  },
};
</script>
