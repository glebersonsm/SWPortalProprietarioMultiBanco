import { AppointmentMultiOwnership } from "@/utils/types/multiownership/appointments";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  Modal,
  ModalDialog,
  ModalOverflow,
  Textarea,
  Typography,
} from "@mui/joy";
import { formatDate } from "@/utils/dates";
import React from "react";
import useCloseModal from "@/hooks/useCloseModal";

type ShowDetailsModalProps = {
  appointment: AppointmentMultiOwnership;
  shouldOpen: boolean;
};

export default function MultiOwnershipShowDetailsModal({
  appointment,
  shouldOpen,
}: ShowDetailsModalProps) {
  const closeModal = useCloseModal();

  return (
    <Modal open={shouldOpen} onClose={closeModal}>
      <ModalOverflow>
        <ModalDialog sx={{ width: { xs: "200px", sm: "350px", md: "800px" } }}>
          <DialogTitle>Detalhes do agendamento</DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid xs={12} sm={6} md={4}>
                <FormControl>
                  <FormLabel>Id agendamento</FormLabel>
                  <Textarea
                    defaultValue={appointment.periodCoteAvailabilityId}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <FormControl>
                  <FormLabel>Data inicial</FormLabel>
                  <Textarea
                    defaultValue={formatDate(appointment.initialDate)}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <FormControl>
                  <FormLabel>Data final</FormLabel>
                  <Textarea
                    defaultValue={formatDate(appointment.finalDate)}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid xs={12}>
                {appointment?.bookings?.map((booking) => (
                  <Accordion key={booking.id}>
                    <AccordionSummary>
                      <Typography>Reserva {booking.id}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={1}>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Id da reserva</FormLabel>
                            <Textarea defaultValue={booking.id} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Checkin</FormLabel>
                            <Textarea
                              defaultValue={formatDate(booking.checkin)}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Checkout</FormLabel>
                            <Textarea
                              defaultValue={formatDate(booking.checkout)}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Data da reserva</FormLabel>
                            <Textarea
                              defaultValue={formatDate(booking.reserveDate)}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Textarea defaultValue={booking.status} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Tipo de pensão</FormLabel>
                            <Textarea
                              defaultValue={booking.pensionType}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Tipo de hóspede</FormLabel>
                            <Textarea
                              defaultValue={booking.hostType}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Tipo UH nome</FormLabel>
                            <Textarea
                              defaultValue={booking.uhNameType}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Adultos</FormLabel>
                            <Textarea defaultValue={booking.adults} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Crianças 1</FormLabel>
                            <Textarea
                              defaultValue={booking.children1}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Crianças 2</FormLabel>
                            <Textarea
                              defaultValue={booking.children2}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Nome do hotel</FormLabel>
                            <Textarea
                              defaultValue={booking.hotelNome}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Nome do hóspede</FormLabel>
                            <Textarea
                              defaultValue={booking.hostName}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Cota</FormLabel>
                            <Textarea defaultValue={booking.cote} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Cliente MY MABU</FormLabel>
                            <Textarea
                              defaultValue={booking.ownerName}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Documento</FormLabel>
                            <Textarea
                              defaultValue={booking.ownerCpfCnpj}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                          <FormControl>
                            <FormLabel>Id do Cliente MY MABU</FormLabel>
                            <Textarea defaultValue={booking.ownerId} readOnly />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
