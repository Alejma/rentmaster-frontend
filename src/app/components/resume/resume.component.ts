import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, NgApexchartsModule } from "ng-apexcharts";
import { TenantService } from "../../services/tenant.service";
import { ApartmentService } from "../../services/apartment.service";
import { ContractService } from "../../services/contract.service";
import { TicketService } from "../../services/ticket.service";
import { forkJoin } from "rxjs";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  labels: any;
};

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [NavbarComponent, NgApexchartsModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};
  public chartOptionsPie: Partial<ChartOptions> = {}; // Nueva propiedad para la gráfica de pie

  constructor(
    private tenantService: TenantService,
    private apartmentService: ApartmentService,
    private contractService: ContractService,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    // Obtener los datos
    forkJoin({
      tenants: this.tenantService.getTenants(),
      apartments: this.apartmentService.getApartments(),
      contracts: this.contractService.getContracts(),
      tickets: this.ticketService.getTickets()
    }).subscribe((data) => {
      this.updateChartData(data);
    });
  }

  private updateChartData(data: any) {
    // Configuración de la gráfica de barras
    this.chartOptions = {
      series: [
        {
          name: "Arrendatarios",
          data: [data.tenants.length]
        },
        {
          name: "Apartmentos",
          data: [data.apartments.length]
        },
        {
          name: "Contratos",
          data: [data.contracts.length]
        },
        {
          name: "Tickets",
          data: [data.tickets.length]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Total de registros"
      },
      xaxis: {
        categories: ["Total"]
      }
    };

    // Configuración de la gráfica de torta (Pie Chart)
    this.chartOptionsPie = {
      series: [
        data.tenants.length,
        data.apartments.length,
        data.contracts.length,
        data.tickets.length
      ],
      labels: ["Arrendatarios", "Apartamentos", "Contratos", "Tickets"],
      chart: {
        height: 350,
        type: "pie",
        toolbar: {
          show: true, // Habilita la barra de herramientas
          tools: {
            download: true // Habilita la opción de descarga
          }
        }
      },
      title: {
        text: "Distribución Total"
      },
      
    };
  }
}

