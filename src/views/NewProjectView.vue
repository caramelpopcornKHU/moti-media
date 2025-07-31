<template>
  <div class="d-flex flex-column flex-root" id="kt_app_root">
    <!--begin::Page-->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <!--begin::Wrapper-->
      <div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
        <!--begin::Main-->
        <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
          <!--begin::Content wrapper-->
          <div class="d-flex flex-column flex-column-fluid">
            <!--begin::Content-->
            <div id="kt_app_content" class="app-content flex-column-fluid">
              <!--begin::Content container-->
              <div id="kt_app_content_container" class="app-container container-xxl">
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Create New Project</h3>
                  </div>
                  <div class="card-body">
                    <form @submit.prevent="createProject">
                      <div class="mb-3">
                        <label for="projectTitle" class="form-label">Project Name</label>
                        <input type="text" class="form-control" id="projectTitle" v-model="project_name" required>
                      </div>
                      <div class="mb-3">
                        <label for="projectRole" class="form-label">Role</label>
                        <input type="text" class="form-control" id="projectRole" v-model="role">
                      </div>
                      <div class="mb-3">
                        <label for="contributionPercentage" class="form-label">Contribution Percentage (%)</label>
                        <input type="number" class="form-control" id="contributionPercentage" v-model="contribution_percentage" step="0.01">
                      </div>
                      <div class="mb-3">
                        <label for="startDate" class="form-label">Start Date</label>
                        <input type="date" class="form-control" id="startDate" v-model="start_date">
                      </div>
                      <div class="mb-3">
                        <label for="endDate" class="form-label">End Date</label>
                        <input type="date" class="form-control" id="endDate" v-model="end_date">
                      </div>
                      <div class="mb-3">
                        <label for="projectStatus" class="form-label">Status</label>
                        <input type="text" class="form-control" id="projectStatus" v-model="status">
                      </div>
                      <div class="mb-3">
                        <label for="projectSummary" class="form-label">Summary of My Work</label>
                        <textarea class="form-control" id="projectSummary" rows="3" v-model="summary"></textarea>
                      </div>
                      <div class="mb-3">
                        <label for="commitCount" class="form-label">Commit Count</label>
                        <input type="number" class="form-control" id="commitCount" v-model="commit_count">
                      </div>
                      <div class="mb-3">
                        <label for="issuesResolvedCount" class="form-label">Issues Resolved Count</label>
                        <input type="number" class="form-control" id="issuesResolvedCount" v-model="issues_resolved_count">
                      </div>
                      <div class="mb-3">
                        <label for="performanceMetric" class="form-label">Performance Metric</label>
                        <input type="text" class="form-control" id="performanceMetric" v-model="performance_metric">
                      </div>
                      <div class="mb-3">
                        <label for="teamEvaluation" class="form-label">Team Evaluation</label>
                        <textarea class="form-control" id="teamEvaluation" rows="3" v-model="team_evaluation"></textarea>
                      </div>
                      <div class="mb-3">
                        <label for="referenceLink" class="form-label">Reference Link</label>
                        <input type="url" class="form-control" id="referenceLink" v-model="reference_link">
                      </div>
                      <button type="submit" class="btn btn-primary">Create Project</button>
                    </form>
                  </div>
                </div>
              </div>
              <!--end::Content container-->
            </div>
            <!--end::Content-->
          </div>
          <!--end::Content wrapper-->
        </div>
        <!--end::Main-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NewProjectView',
  data() {
    return {
      project_name: '',
      role: '',
      contribution_percentage: null,
      start_date: '',
      end_date: '',
      status: '',
      summary: '',
      commit_count: null,
      issues_resolved_count: null,
      performance_metric: '',
      team_evaluation: '',
      reference_link: '',
    };
  },
  methods: {
    async createProject() {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        alert('You must be logged in to create a project.');
        this.$router.push('/sign-in');
        return;
      }

      try {
        const projectData = {
          user_id: userId,
          project_name: this.project_name,
          role: this.role,
          contribution_percentage: this.contribution_percentage,
          start_date: this.start_date,
          end_date: this.end_date,
          status: this.status,
          summary: this.summary,
          commit_count: this.commit_count,
          issues_resolved_count: this.issues_resolved_count,
          performance_metric: this.performance_metric,
          team_evaluation: this.team_evaluation,
          reference_link: this.reference_link,
        };

        const response = await axios.post('http://localhost:3000/api/projects', projectData);
        console.log('Project created:', response.data);
        alert('Project created successfully!');
        this.$router.push('/my-projects'); // Redirect after creation
      } catch (error) {
        console.error('Error creating project:', error);
        alert('Failed to create project.');
      }
    },
  },
};
</script>