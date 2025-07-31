<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section text-center text-white bg-dark py-5">
      <div class="container">
        <h1 class="display-4">Quantify Your Passion, Connect with Your Tribe</h1>
        <p class="lead">Visualize your contributions, measure your growth, and find collaborators who share your drive.</p>
        <router-link to="/sign-up" class="btn btn-primary btn-lg mt-3">Get Started</router-link>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-4">
            <div class="feature-item">
              <i class="fas fa-chart-line fa-3x text-primary mb-3"></i>
              <h3>Visualize Your Impact</h3>
              <p class="text-muted">Track your project contributions, from commits to resolved issues, with insightful analytics.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-item">
              <i class="fas fa-users fa-3x text-primary mb-3"></i>
              <h3>Find Your Passion Type</h3>
              <p class="text-muted">Discover your work style and connect with users who have a similar passion type.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-item">
              <i class="fas fa-comments fa-3x text-primary mb-3"></i>
              <h3>Collaborate in Real-Time</h3>
              <p class="text-muted">Use the integrated chat to communicate seamlessly with your project team.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section bg-light text-center py-5">
      <div class="container">
        <h2>Ready to unlock your potential?</h2>
        <p>Join a community of passionate creators and builders.</p>
        <router-link to="/sign-up" class="btn btn-primary btn-lg">Sign Up Now</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>
.hero-section {
  background: url('/metronic/media/photos/photo2.jpg') no-repeat center center;
  background-size: cover;
  padding: 100px 0;
}

.feature-item {
  padding: 30px;
}

.cta-section {
  padding: 50px 0;
}

/* Add Font Awesome for icons - make sure to include it in your project */
</style>
