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
                <!--begin::Card-->
                <div class="card card-flush">
                  <!--begin::Card header-->
                  <div class="card-header align-items-center py-5 gap-2 gap-md-5">
                    <!--begin::Card title-->
                    <div class="card-title">
                      <h3 class="card-label">My Projects</h3>
                    </div>
                    <!--end::Card title-->
                    <!--begin::Card toolbar-->
                    <div class="card-toolbar flex-row-fluid justify-content-end gap-5">
                      <!--begin::Add product-->
                      <router-link to="/new-project" class="btn btn-primary">Add New Project</router-link>
                      <!--end::Add product-->
                    </div>
                    <!--end::Card toolbar-->
                  </div>
                  <!--end::Card header-->
                  <!--begin::Card body-->
                  <div class="card-body pt-0">
                    <!--begin::Table-->
                    <div v-if="loading" class="text-center py-5">Loading projects...</div>
                    <div v-else-if="error" class="text-center text-danger py-5">Failed to load projects: {{ error.message }}</div>
                    <div v-else-if="projects.length === 0" class="text-center text-muted py-5">No projects found.</div>
                    <div v-else class="table-responsive">
                      <table class="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_sales_table">
                        <thead>
                          <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                            <th class="min-w-100px">Project Name</th>
                            <th class="min-w-100px">Role</th>
                            <th class="min-w-100px">Contribution (%)</th>
                            <th class="min-w-100px">Period</th>
                            <th class="min-w-100px">Status</th>
                            <th class="min-w-150px">Summary of My Work</th>
                            <th class="min-w-100px">Commits</th>
                            <th class="min-w-100px">Issues Resolved</th>
                            <th class="min-w-100px">Performance Metric</th>
                            <th class="min-w-100px">Team Evaluation</th>
                            <th class="min-w-100px">Reference Link</th>
                            <th class="text-end min-w-100px">Actions</th>
                          </tr>
                        </thead>
                        <tbody class="fw-semibold text-gray-600">
                          <tr v-for="project in projects" :key="project.id">
                            <td>{{ project.project_name }}</td>
                            <td>{{ project.role }}</td>
                            <td>{{ project.contribution_percentage }}</td>
                            <td>{{ project.start_date }} ~ {{ project.end_date }}</td>
                            <td>{{ project.status }}</td>
                            <td>{{ project.summary }}</td>
                            <td>{{ project.commit_count }}</td>
                            <td>{{ project.issues_resolved_count }}</td>
                            <td>{{ project.performance_metric }}</td>
                            <td>{{ project.team_evaluation }}</td>
                            <td><a :href="project.reference_link" target="_blank">Link</a></td>
                            <td class="text-end">
                              <a href="#" class="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                Actions
                                <i class="ki-duotone ki-down fs-5 ms-1"></i>
                              </a>
                              <!--begin::Menu-->
                              <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4" data-kt-menu="true">
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                  <a href="#" class="menu-link px-3">View</a>
                                </div>
                                <!--end::Menu item-->
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                  <a href="#" class="menu-link px-3">Edit</a>
                                </div>
                                <!--end::Menu item-->
                                <!--begin::Menu item-->
                                <div class="menu-item px-3">
                                  <a href="#" class="menu-link px-3" data-kt-ecommerce-order-filter="delete_row">Delete</a>
                                </div>
                                <!--end::Menu item-->
                              </div>
                              <!--end::Menu-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--end::Table-->
                  </div>
                  <!--end::Card body-->
                </div>
                <!--end::Card-->
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
  name: 'MyProjectsView',
  data() {
    return {
      projects: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        this.error = new Error('User not logged in.');
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}/projects`);
        this.projects = response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
