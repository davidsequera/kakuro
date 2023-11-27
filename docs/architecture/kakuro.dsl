workspace {
    
    !identifiers hierarchical
    
    model {
        user = person "User" "User of the application" "User"
    
        softwareSystem = softwareSystem "Kakuro Game" {

            webapp = container "Kakuro Game Application" {
                machine_player = component "Machine Player" "Algotithms to solve the game" "Web" "Machine"
                user_interface = component "User Interface" "Shows board and allows actions on the game" "Web" "UI" 
                game_interface = component "Game Interface" "Manages the game state and the game rules" "Web" "Game"
            }
            

            user -> webapp.user_interface "Uses" "Browser HTTPS"
            webapp.user_interface -> webapp.game_interface "Uses" "ReactiveX"
            webapp.machine_player -> webapp.game_interface "Uses" "WebWorkers"
        }
    }
    
    views {

        systemLandscape softwareSystem "SystemLandscape" {
            include *
            autolayout
        }
        container softwareSystem "Container" {
            include *
            autolayout lr
        }

        component softwareSystem.webapp "Components_serviceMQ" {
            include *
            autolayout
        }
 
        theme default
        styles {
            element "Person" {
                shape Person
            }

            element "Web Client" {
                shape WebBrowser
            }
            element "UI" {
                background #F08CA4
            }
            element "Machine" {
                background #DD8BFE
            }
            element "Game" {
                background #8CD0F0
            }
            
        }

    }

}