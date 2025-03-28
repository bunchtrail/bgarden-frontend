- **bgarden-frontend**
  - `craco.config.js` (538.0 B)
  - **docs**
    - `refactoring.md` (15.4 KB)
    - `styles-guide.md` (3.2 KB)
    - `Структура_bgarden-frontend_от_29-03-2025.md` (13.4 KB)
  - **logs**
  - `package-lock.json` (707.2 KB)
  - `package.json` (1.7 KB)
  - `postcss.config.js` (82.0 B)
  - **public**
    - `favicon.ico` (3.8 KB)
    - **images**
      - **backgrounds**
      - `BotGardenMainImage.jpg` (263.3 KB)
      - **features**
      - **specimens**
        - `placeholder.jpg` (5.2 KB)
    - `index.html` (1.7 KB)
    - `logo192.png` (5.2 KB)
    - `logo512.png` (9.4 KB)
    - `manifest.json` (517.0 B)
    - `mockServiceWorker.js` (8.0 KB)
    - `robots.txt` (70.0 B)
  - **scripts**
  - **src**
    - `App.css` (602.0 B)
    - `App.test.tsx` (273.0 B)
    - `App.tsx` (612.0 B)
    - **assets**
    - **contexts**
    - **docs**
      - `services.md` (4.7 KB)
    - **hooks**
    - `index.css` (443.0 B)
    - `index.tsx` (1.5 KB)
    - `logo.svg` (2.6 KB)
    - **modules**
      - **auth**
        - **components**
          - `AuthProviderWithNotifications.tsx` (988.0 B)
          - `ProtectedRoute.tsx` (1.8 KB)
        - **contexts**
          - `AuthContext.tsx` (10.1 KB)
        - **docs**
          - `styles-guide.md` (8.5 KB)
        - **hooks**
          - `index.ts` (91.0 B)
          - `useAuth.ts` (51.0 B)
          - `useTokenRefresh.ts` (3.5 KB)
        - `index.ts` (338.0 B)
        - `README.md` (2.9 KB)
        - **services**
          - `authService.ts` (6.5 KB)
        - **types**
          - `index.ts` (1.8 KB)
      - **expositions**
        - **contexts**
        - **hooks**
        - **styles**
      - **home**
        - **components**
          - `AuthenticatedHomePage.tsx` (1.6 KB)
          - `PublicHomePage.tsx` (2.2 KB)
          - `SectorGrid.tsx` (1.8 KB)
          - **time-based-greeting**
            - `AnimatedText.tsx` (1.4 KB)
            - `FloatingElements.tsx` (2.2 KB)
            - `index.ts` (98.0 B)
            - `TimeBasedGreeting.tsx` (11.4 KB)
            - `timeUtils.tsx` (11.6 KB)
          - `UserTools.tsx` (6.3 KB)
          - `WelcomeUser.tsx` (1.1 KB)
        - **hooks**
        - `index.ts` (600.0 B)
        - **styles**
        - **utils**
      - **layouts**
        - **components**
          - `MainLayout.tsx` (542.0 B)
        - `index.ts` (96.0 B)
      - **map**
        - **components**
          - **control-panel**
            - `ControlButtons.tsx` (2.0 KB)
            - `CustomSections.tsx` (967.0 B)
            - `index.ts` (737.0 B)
            - `LayerSelector.tsx` (3.2 KB)
            - `MapSettingsSection.tsx` (2.1 KB)
            - `ModeToggle.tsx` (2.4 KB)
            - `PanelHeader.tsx` (2.6 KB)
            - `types.ts` (4.9 KB)
            - `UnifiedControlPanel.tsx` (12.3 KB)
          - **drawing**
          - `index.ts` (588.0 B)
          - **map-card**
            - `MapCard.tsx` (739.0 B)
          - **map-components**
            - `BaseMapContainer.tsx` (1.5 KB)
            - **deprecated**
            - `EmptyMapView.tsx` (2.2 KB)
            - `ErrorView.tsx` (1.3 KB)
            - `index.ts` (641.0 B)
            - `LoadingView.tsx` (487.0 B)
            - `MapBoundsHandler.tsx` (706.0 B)
            - `MapImageLayer.tsx` (794.0 B)
            - `MapReadyHandler.tsx` (754.0 B)
            - `MapRegionsLayer.tsx` (6.7 KB)
          - **map-content**
            - `index.ts` (80.0 B)
            - `MapContentController.tsx` (3.9 KB)
            - `MapContentStateRenderer.tsx` (2.9 KB)
          - **map-image-layer**
          - **map-layers**
            - `index.ts` (66.0 B)
            - **MapDrawingLayer**
              - **components**
                - `AreaCreationModal.tsx` (1.6 KB)
                - `AreaEditModal.tsx` (1.6 KB)
              - **hooks**
                - `useLeafletEvents.tsx` (8.3 KB)
              - **utils**
                - `cloneLayers.ts` (1.1 KB)
                - `logDebug.ts` (587.0 B)
            - `MapDrawingLayer.tsx` (13.8 KB)
            - `MapLayersManager.tsx` (5.2 KB)
          - **map-submodules**
            - `index.ts` (250.0 B)
          - **map-view**
            - `ImageBoundsCalculator.tsx` (1.1 KB)
            - `MapViewContainer.tsx` (3.0 KB)
          - `MapPage.tsx` (1.7 KB)
          - `MapPageContent.tsx` (3.8 KB)
          - **plant-info**
            - `EnhancedPlantMarkersLayer.tsx` (5.1 KB)
            - **hooks**
              - `useMarkers.ts` (2.5 KB)
            - `index.ts` (344.0 B)
            - **managers**
              - `MarkerClusterManager.ts` (7.6 KB)
            - **services**
              - `PlantDataService.ts` (2.0 KB)
            - **utils**
              - `MarkerIconFactory.ts` (3.5 KB)
        - **contexts**
          - `MapConfigContext.tsx` (7.0 KB)
          - `MapContext.tsx` (1.3 KB)
        - **docs**
          - `README.md` (2.1 KB)
          - `Структура_map_от_20-03-2025.md` (4.4 KB)
        - **hooks**
          - `index.ts` (341.0 B)
          - `useMap.ts` (333.0 B)
          - `useMapControlPanel.ts` (6.4 KB)
          - `useMapData.ts` (6.5 KB)
          - `useMapLayers.ts` (2.0 KB)
        - `index.ts` (2.5 KB)
        - **services**
          - `index.ts` (148.0 B)
          - `mapService.ts` (1.6 KB)
          - `plantService.ts` (6.3 KB)
        - **styles**
          - `index.ts` (5.7 KB)
          - `leaflet-overrides.css` (10.4 KB)
        - **types**
          - `mapTypes.ts` (3.8 KB)
      - **navigation**
        - **components**
          - **configs**
            - `defaultNavConfig.tsx` (1010.0 B)
          - **icons**
            - `index.tsx` (1.2 KB)
          - `index.ts` (170.0 B)
          - `Navbar.tsx` (5.4 KB)
          - `NavbarItem.tsx` (3.1 KB)
        - **contexts**
        - **docs**
          - `styles-guide.md` (4.4 KB)
        - **hooks**
          - `index.ts` (1.6 KB)
          - `useNavigation.ts` (1.6 KB)
        - `index.ts` (481.0 B)
        - `README.md` (3.1 KB)
        - **types**
          - `index.ts` (428.0 B)
      - **notifications**
        - **components**
          - `NotificationContainer.tsx` (730.0 B)
          - `NotificationItem.tsx` (6.2 KB)
        - **contexts**
          - `NotificationContext.tsx` (2.3 KB)
        - **docs**
        - **hooks**
          - `useNotification.ts` (1.1 KB)
        - `index.ts` (335.0 B)
        - **services**
        - **styles**
          - `notification.css` (3.2 KB)
      - **specimens**
        - **components**
          - **forms**
          - **specimen-display**
            - `AdditionalInfoCard.tsx` (3.9 KB)
            - `BasicInfoCard.tsx` (4.0 KB)
            - `GeographicInfoCard.tsx` (3.9 KB)
            - `index.ts` (610.0 B)
            - `SpecimenDisplay.tsx` (1.1 KB)
            - `SpecimenHeader.tsx` (2.3 KB)
            - `SpecimenImageCard.tsx` (7.5 KB)
            - `TimelineInfoCard.tsx` (2.3 KB)
          - **specimen-form**
            - **form-progress**
              - `FormProgress.tsx` (1.4 KB)
            - **form-stepper**
              - `FormStepper.tsx` (3.0 KB)
            - **hooks**
              - `useFormChanges.ts` (2.2 KB)
              - `useFormNavigation.tsx` (1.5 KB)
              - `useFormValidation.tsx` (2.3 KB)
            - `ImageUploader.tsx` (7.0 KB)
            - `index.ts` (522.0 B)
            - `NavigationButtons.tsx` (2.9 KB)
            - **sections**
              - **additional-info**
                - `AdditionalInfoSection.tsx` (2.7 KB)
                - `index.ts` (65.0 B)
              - **basic-info**
                - `BasicInfoSection.tsx` (2.0 KB)
                - **components**
                  - `BasicInfoForm.tsx` (3.0 KB)
                  - `FormField.tsx` (1.9 KB)
                  - `Icon.tsx` (1.7 KB)
                  - `index.ts` (215.0 B)
                  - `InfoBlock.tsx` (2.3 KB)
                  - `SectionHeader.tsx` (610.0 B)
                - `index.ts` (55.0 B)
              - **geography**
                - **components**
                  - `CoordinatesInput.tsx` (4.1 KB)
                  - `ExpositionSelector.tsx` (1.2 KB)
                  - `index.ts` (405.0 B)
                  - `LocationDescriptionInput.tsx` (1016.0 B)
                  - `MapMarker.tsx` (7.7 KB)
                  - `RegionMapSelector.tsx` (3.1 KB)
                  - `RegionSelector.tsx` (1.2 KB)
                - `GeographySection.tsx` (4.1 KB)
                - **hooks**
                  - `index.ts` (107.0 B)
                  - `useMapData.ts` (714.0 B)
                  - `useRegionMarkerLogic.ts` (6.1 KB)
                - `index.ts` (55.0 B)
              - **taxonomy**
                - `index.ts` (53.0 B)
                - `TaxonomySection.tsx` (2.3 KB)
            - `SpecimenForm.tsx` (18.5 KB)
            - `StepContainer.tsx` (864.0 B)
            - `StepRenderer.tsx` (2.2 KB)
            - **utils**
              - `calculateFormProgress.ts` (1.9 KB)
          - **specimen-gallery**
            - **components**
              - `ErrorState.tsx` (1.1 KB)
              - `GalleryHeader.tsx` (984.0 B)
              - `ImageCounter.tsx` (535.0 B)
              - `ImageUploadModal.tsx` (2.0 KB)
              - `ImageViewModal.tsx` (3.6 KB)
              - `index.ts` (505.0 B)
              - `MainImageDisplay.tsx` (4.2 KB)
              - `SpecimenInfoFooter.tsx` (530.0 B)
              - `ThumbnailsList.tsx` (3.1 KB)
            - **hooks**
              - `index.ts` (55.0 B)
              - `useGalleryImages.ts` (8.5 KB)
            - `index.ts` (45.0 B)
            - `README.md` (1.9 KB)
            - `SpecimenGallery.tsx` (4.0 KB)
          - **specimens-components**
            - **card-parts**
              - `DetailItem.tsx` (800.0 B)
              - `index.ts` (343.0 B)
              - `SpecimenBadges.tsx` (1.3 KB)
              - `SpecimenCardFooter.tsx` (516.0 B)
              - `SpecimenCardHeader.tsx` (1.1 KB)
              - `SpecimenDetails.tsx` (1.0 KB)
            - `SpecimenCard.tsx` (6.2 KB)
            - `SpecimenModal.tsx` (4.4 KB)
            - `SpecimenRow.tsx` (2.6 KB)
            - `SpecimensGrid.tsx` (1.8 KB)
            - `SpecimensTable.tsx` (4.6 KB)
          - **specimens-controls**
            - `ActionButtons.tsx` (4.2 KB)
            - `SpecimensSearchBar.tsx` (4.3 KB)
            - `SpecimensSortControls.tsx` (1.7 KB)
          - **specimens-states**
            - `SpecimensEmptyState.tsx` (4.7 KB)
            - `SpecimensError.tsx` (1.1 KB)
            - `SpecimensLoading.tsx` (726.0 B)
          - **specimens-ui**
            - `MobileAddButton.tsx` (1.5 KB)
            - `SpecimensHeader.tsx` (5.3 KB)
        - **contexts**
        - **docs**
          - `api-integration.md` (8.6 KB)
          - `component-library.md` (12.9 KB)
          - `development-guide.md` (7.4 KB)
          - `README.md` (6.4 KB)
          - `styles-guide.md` (5.1 KB)
        - **hooks**
          - `index.ts` (285.0 B)
          - `useReferenceData.ts` (1.7 KB)
          - `useSpecimenData.ts` (1.4 KB)
          - `useSpecimenImage.ts` (10.3 KB)
          - `useSpecimens.ts` (7.2 KB)
        - `index.ts` (3.9 KB)
        - **services**
          - `biometryService.ts` (1.9 KB)
          - `expositionService.ts` (1.8 KB)
          - `familyService.ts` (1.7 KB)
          - `index.ts` (511.0 B)
          - `phenologyService.ts` (1.9 KB)
          - `specimenService.ts` (11.0 KB)
        - **styles**
          - `index.ts` (3.4 KB)
          - `specimen-gallery-styles.ts` (5.5 KB)
        - **types**
          - `index.ts` (3.6 KB)
        - **utils**
      - **ui**
        - **components**
          - `AbstractPattern.tsx` (892.0 B)
          - `Button.tsx` (2.6 KB)
          - `Card.tsx` (2.6 KB)
          - **Form**
            - **CheckboxField**
            - `index.ts` (676.0 B)
            - `Select.tsx` (3.9 KB)
            - `Switch.tsx` (2.3 KB)
            - **Textarea**
              - `index.ts` (88.0 B)
              - `Textarea.tsx` (2.2 KB)
            - `TextField.tsx` (2.6 KB)
          - `index.ts` (107.0 B)
          - `LoadingSpinner.tsx` (669.0 B)
          - `Modal.tsx` (9.6 KB)
          - `SectorCard.tsx` (2.3 KB)
        - `index.ts` (1.4 KB)
      - **utils**
        - **components**
        - **contexts**
        - **hooks**
        - **mapHelpers**
        - **services**
        - **styles**
        - **types**
    - **pages**
      - **auth**
        - `LoginPage.tsx` (8.9 KB)
        - `ProfilePage.tsx` (8.6 KB)
        - `RegisterPage.tsx` (12.4 KB)
      - `Home.tsx` (1.8 KB)
      - `NotFound.tsx` (261.0 B)
      - **sector**
      - **specimens**
        - `SpecimenPage.tsx` (10.4 KB)
        - `SpecimensListPage.tsx` (6.6 KB)
      - **user**
    - `react-app-env.d.ts` (41.0 B)
    - `reportWebVitals.ts` (425.0 B)
    - **routes**
      - `authRoutes.tsx` (620.0 B)
      - `expositionRoutes.tsx` (662.0 B)
      - `index.tsx` (882.0 B)
      - `mapRoutes.tsx` (1.5 KB)
      - `specimenRoutes.tsx` (1.1 KB)
    - **services**
      - `httpClient.ts` (14.2 KB)
      - **regions**
        - `index.ts` (3.3 KB)
        - `PolygonFactory.ts` (19.9 KB)
        - `RegionBridge.ts` (3.6 KB)
        - `RegionService.ts` (11.0 KB)
        - `RegionUtils.ts` (15.9 KB)
        - `types.ts` (3.0 KB)
    - `setupTests.ts` (241.0 B)
    - **styles**
      - `animations.css` (1.9 KB)
      - `global-styles.ts` (5.2 KB)
      - `index.ts` (470.0 B)
      - `output.css` (59.2 KB)
    - **types**
    - **utils**
      - `logger.ts` (1.1 KB)
  - `tailwind.config.js` (224.0 B)
  - `tests_list.txt` (129.0 B)
  - `tsconfig.json` (896.0 B)
